using BLL.Shared.Notif;
using DAL.Shared;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace INTO.Svc.Process
{
    public class NotificationProcessor<T> : BaseThread where T : Notification
    {
        protected ICollection<T> notifications { get; }
        protected Notifier Notifier { get; }
        public NotificationProcessor(ICollection<T> notifs, Notifier notifier)
        {
            this.notifications = notifs;
            this.Notifier = notifier;
        }

        protected override async void Execute()
        {
            IList<Task<IList<NotificationResponse>>> tasks = new List<Task<IList<NotificationResponse>>>();
            IList<NotificationResponse> responses = new List<NotificationResponse>();
            foreach (Notification notification in this.notifications)
            {
                Task<IList<NotificationResponse>> task = await Task.FromResult(notification.NotifyAsync());
                foreach(NotificationResponse response in task.Result)
                {
                    responses.Add(response);
                }
            }
            int rows = ScheduleDB.UpdateNotifStatus(responses, this.Notifier.Configuration.GetConnectionString(Notifier.DEFAULT_CONNECTION));
        }
    }
}
