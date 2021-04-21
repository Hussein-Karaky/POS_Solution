using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.Shared.Notif
{
    public abstract class Notification
    {
        public long Id { get; set; }
        public int? TitleId { get; set; }
        public int? ContentId { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        [JsonProperty("type")]
        public byte ByteType { get { return (byte)this.Type;  } set { this.Type = value > 0 && value < 4 ? (NotificationType)value : NotificationType.Email; } }
        [JsonIgnore]
        public NotificationType Type { get; set; } = NotificationType.Email;
        public long? EventId { get; set; }
        public int? EventType { get; set; }
        public byte? Position { get; set; }
        public bool Parameterized { get; set; }
        public bool Active { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public ICollection<byte> EntityTypes { get; set; }
        public ICollection<User> Users { get; set; }
        public static INotificationFactory<Notification>[] Factories { get; } = new INotificationFactory<Notification>[Enum.GetValues(typeof(NotificationType)).Length];
        static Notification()
        {
            Factories[(byte)NotificationType.Push - 1] = new PushNotificationFactory();
            Factories[(byte)NotificationType.Email - 1] = new EmailNotificationFactory();
            Factories[(byte)NotificationType.SMS - 1] = new SMSNotificationFactory();
        }
        public Notification(NotificationType type = NotificationType.Email) {
            this.Type = type;
        }
        protected INotificationFactory<Notification> GetFactory()
        {
            return Factories[this.ByteType];
        }
        public abstract IList<NotificationResponse> Notify();
        public abstract Task<IList<NotificationResponse>> NotifyAsync();
        public enum NotificationType
        {
            Push = 1,
            Email = 2,
            SMS = 3
        }
    }
}
