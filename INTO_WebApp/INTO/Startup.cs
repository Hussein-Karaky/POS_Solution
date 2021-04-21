using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;

namespace INTO
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            StaticConfig = configuration;
        }

        public IConfiguration Configuration { get; }
        public static IConfiguration StaticConfig { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //      var redis = RedisConnectionManager.SafeCoonect;

            //      services
            //  .AddDataProtection()
            //.PersistKeysToRedis(redis, "Key");
            services.AddDataProtection()
              .PersistKeysToFileSystem(new DirectoryInfo(@"c:\temp-keys\"));
            services.AddCors(options =>
            {
                options.AddPolicy(name: "INTOAllowSpecificOrigins",
                                  builder =>
                                  {
                                      builder.WithOrigins("https://localhost:5001", "http://localhost:5000", "https://192.168.0.112",
                                                          "http://192.168.0.112").AllowAnyHeader()
                                                  .AllowAnyMethod(); ;
                                  });
            });
            services.AddControllersWithViews().AddNewtonsoftJson();
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromSeconds(10);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }
            app.UseSession();
            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseCors("INTOAllowSpecificOrigins");
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                //Nabih
                endpoints.MapControllerRoute(
                    name: "Payment",
                    pattern: "{controller=Payment}/{action=PayNow}/{id?}");
                endpoints.MapControllerRoute(
                    name: "eclass",
                    pattern: "{controller=Collaboration}/{action=Index}/{id?}");
                endpoints.MapControllerRoute(
                    name: "activate",
                    pattern: "{controller=SignUp}/{action=Activate}/{id?}/{activationCode?}");
                endpoints.MapControllerRoute(
                    name: "tutorType",
                    pattern: "{controller=Tutor}/{action=TutorDocumentary}/{docId?}/{eType?}");
                endpoints.MapControllerRoute(
                    name: "tutorP2Type",
                    pattern: "{controller=Tutor}/{action=TutorSecondDocumentary}/{docId?}/{eType?}");
                endpoints.MapControllerRoute(
                    name: "tutorP2Type",
                    pattern: "{controller=Tutor}/{action=GetEducation}/{id?}/{lang?}");
                endpoints.MapControllerRoute(
                    name: "emailConf",
                    pattern: "{controller=Tutor}/{action=EmailConfirmation}/{userId?}/{objEntityId?}/{step?}/{lang?}");
                endpoints.MapControllerRoute(
                    name: "rdyIntv",
                    pattern: "{controller=Tutor}/{action=ReaForInterview}/{id?}/{code?}/{step?}/{lang?}");
                endpoints.MapControllerRoute(
                    name: "tutorP2Type",
                    pattern: "{controller=Tutor}/{action=MaterialsSvc}/{id?}/{lang?}");
                endpoints.MapControllerRoute(
                    name: "tutorP3Type",
                    pattern: "{controller=Tutor}/{action=TutorThirdDocumentary}/{docId?}/{eType?}");
                endpoints.MapControllerRoute(
                    name: "pwdReset",
                    pattern: "{controller=Account}/{action=ResetPassword}/{id?}/{resetCode?}");
                endpoints.MapControllerRoute(
                    name: "lkp1",
                    pattern: "{controller=LookUp}/{action=Get}/{lkp?}/{objEntityId?}/{key?}/{lang?}");
                endpoints.MapControllerRoute(
                    name: "waMsg",
                    pattern: "{controller=Com}/{action=WApp}/{dest?}/{lang?}");
                endpoints.MapControllerRoute(
                    name: "login",
                    pattern: "{controller=Login}/{action=LoginView}");
                //jinan update
                endpoints.MapControllerRoute(
                   name: "activate",
                   pattern: "{controller=SignUp}/{action=Activate}/{userType?}/{activationCode?}");
                //endpoints.MapControllerRoute(
                //    name: "activate",
                //    pattern: "{controller=SignUp}/{action=Activate}/{id?}/{userType?}/{activationCode?}");
                //jinan add this link
                endpoints.MapControllerRoute(
                    name: "signUp",
                    pattern: "{controller=SignUp}/{action=SignUp}/{type?}/{src?}/{lang?}");
                //jinan add this link
                endpoints.MapControllerRoute(
                   name: "studentProfile",
                   pattern: "{controller=Student}/{action=EditProfile}/{uId?}/{langId?}");
            });
        }
    }
}
