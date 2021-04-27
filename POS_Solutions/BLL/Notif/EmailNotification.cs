using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace POS_Solutions.BLL.Shared.Notif
{

    public class EmailNotification : Notification
    {
        public EmailNotification() : base() { }
        public override IList<NotificationResponse> Notify()
        {
            IList<NotificationResponse> responses = new List<NotificationResponse>();
                new EmailNotifier
                {
                    IsBodyHtml = true,
                    IsSSL = true
                }.Notify(this.Users, this);
            return responses;
        }
        public override async Task<IList<NotificationResponse>> NotifyAsync()
        {

            return await new EmailNotifier
            {
                IsBodyHtml = true,
                IsSSL = true
            }.NotifyAsync(this.Users, this);
        }
    }
}
