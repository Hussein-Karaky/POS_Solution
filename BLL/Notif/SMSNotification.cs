using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace POS_Solutions.BLL.Shared.Notif
{
    public class SMSNotification : Notification
    {
        public SMSNotification() : base(NotificationType.SMS) { }

        public override IList<NotificationResponse> Notify()
        {
            throw new NotImplementedException();
        }

        public override Task<IList<NotificationResponse>> NotifyAsync()
        {
            throw new NotImplementedException();
        }
    }
}
