using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BLL.Shared.Notif;
using BLL.Shared.Struct;
using DAL.Shared;
using INTO.Svc.Process;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace INTO.Svc
{
    public class Notifier : BackgroundService
    {
        private readonly ILogger<Notifier> _logger;
        protected readonly SqlCommand Command;
        public static string DEFAULT_CONNECTION = "DefaultConnection";
        private readonly IConfiguration _configuration;
        public IConfiguration Configuration { get { return this._configuration; } }
        private readonly IServiceScopeFactory _scopeFactory;
        public static int DelayMS = 240000;
        public Notifier(ILogger<Notifier> logger, IConfiguration configuration)//, IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _configuration = configuration;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                //_logger.LogInformation("Worker running at: {time}", DateTimeOffset.Now);
                EmailNotifier.SysRecipients = AppContentDB.GetSourceRecipients(_configuration.GetConnectionString(DEFAULT_CONNECTION));
                DataList<Notification> notifs = ScheduleDB.GetNotifications(Notification.NotificationType.Email, 0 - (short)DateTimeOffset.Now.Offset.TotalMinutes, DateTime.Now.AddMilliseconds(-DelayMS), DateTime.Now.AddMilliseconds(DelayMS), 1, _configuration.GetConnectionString(DEFAULT_CONNECTION));
                Console.WriteLine(string.Concat(notifs.Data.Count, "notifications ready to send."));
                new NotificationProcessor<Notification>(notifs.Data, this).Start();
                Console.WriteLine("Sending notifications...");
                System.GC.Collect();
                await Task.Delay(DelayMS, stoppingToken);
            }
        }
    }
}
