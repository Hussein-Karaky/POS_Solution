﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace POS_Solutions.BLL.Shared.Notif
{
    public class SMSNotificationFactory : INotificationFactory<SMSNotification>
    {
        public SMSNotification Create(long id, SqlDataReader reader)
        {
            return new SMSNotification();
        }
    }
}
