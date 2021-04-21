using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace POS_Solutions.BLL.Shared.Notif
{
    public class EmailNotificationFactory : INotificationFactory<EmailNotification>
    {
        public EmailNotification Create(long id, SqlDataReader reader)
        {
            return new EmailNotification
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
        //public override EmailNotification New(long id, SqlDataReader reader)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
