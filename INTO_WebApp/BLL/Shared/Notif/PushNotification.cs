using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Shared.Notif
{
    public class PushNotification : Notification
    {
        public PushNotification() : base(NotificationType.Push) { }

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
