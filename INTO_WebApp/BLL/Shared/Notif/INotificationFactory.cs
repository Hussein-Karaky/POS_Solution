using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace BLL.Shared.Notif
{
    public interface INotificationFactory<out T> where T : Notification
    {
        public T Create(long id, SqlDataReader reader);
        //public abstract Notification New(long id, SqlDataReader reader);
    }
}
