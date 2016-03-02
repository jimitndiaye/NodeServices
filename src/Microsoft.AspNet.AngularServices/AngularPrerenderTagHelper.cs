using System;
using System.Threading.Tasks;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Http.Extensions;
using Microsoft.AspNet.NodeServices;
using Microsoft.AspNet.Razor.TagHelpers;
using Microsoft.Extensions.PlatformAbstractions;

namespace Microsoft.AspNet.AngularServices
{
    [HtmlTargetElement(Attributes = PrerenderModuleAttributeName)]
    public class AngularPrerenderTagHelper : TagHelper
    {
        static INodeServices fallbackNodeServices; // Used only if no INodeServices was registered with DI

        const string PrerenderModuleAttributeName = "asp-ng2-prerender-module";
        const string PrerenderExportAttributeName = "asp-ng2-prerender-export";
        const string PrerenderPrebootAttributeName = "asp-ng2-prerender-preboot";

        [HtmlAttributeName(PrerenderModuleAttributeName)]
        public string ModuleName { get; set; }

        [HtmlAttributeName(PrerenderExportAttributeName)]
        public string ExportName { get; set; }

        [HtmlAttributeName(PrerenderPrebootAttributeName)]
        public string Preboot { get; set; }

        private IHttpContextAccessor contextAccessor;
        private INodeServices nodeServices;

        public AngularPrerenderTagHelper(IServiceProvider serviceProvider, IHttpContextAccessor contextAccessor)
        {
            this.contextAccessor = contextAccessor;
            this.nodeServices = (INodeServices)serviceProvider.GetService(typeof (INodeServices)) ?? fallbackNodeServices;

            // Consider removing the following. Having it means you can get away with not putting app.AddNodeServices()
            // in your startup file, but then again it might be confusing that you don't need to.
            if (this.nodeServices == null) {
                var appEnv = (IApplicationEnvironment)serviceProvider.GetService(typeof (IApplicationEnvironment));
                this.nodeServices = fallbackNodeServices = Configuration.CreateNodeServices(new NodeServicesOptions {
                    HostingModel = NodeHostingModel.Http,
                    ProjectPath = appEnv.ApplicationBasePath
                });
            }
        }

        public override async Task ProcessAsync(TagHelperContext context, TagHelperOutput output)
        {
            bool preboot = false;
            var result = await AngularRenderer.RenderToString(
                nodeServices: this.nodeServices,
                componentModuleName: this.ModuleName,
                componentExportName: this.ExportName,
                componentTagName: output.TagName,
                requestUrl: UriHelper.GetEncodedUrl(this.contextAccessor.HttpContext.Request),
                preboot: bool.TryParse(this.Preboot, out preboot) && preboot
            );
            output.SuppressOutput();
            output.PostElement.AppendHtml(result);
        }
    }
}
