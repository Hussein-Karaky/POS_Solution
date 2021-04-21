using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace BLL.Shared.Notif
{
    public class PushNotificationFactory : INotificationFactory<PushNotification>
    {
        public PushNotification Create(long id, SqlDataReader reader)
        {
            return new PushNotification
            {
                Id = id,
                Title = reader["Title"].ToString(),
                Content = reader["Content"].ToString(),
                ByteType = Convert.ToByte(reader["Type"]),
                StartDate = reader["StartDate"] != DBNull.Value ? Convert.ToDateTime(reader["StartDate"]) : default(DateTime?),
                Active = Convert.ToBoolean(reader["IsActive"]),
                DateCreated = Convert.ToDateTime(reader["DateCreated"]),
                ExpiryDate = reader["ExpiryDate"] != DBNull.Value ? Convert.ToDateTime(reader["ExpiryDate"]) : default(DateTime?),
                Users = new List<User>()
            };
        }
    }
}
