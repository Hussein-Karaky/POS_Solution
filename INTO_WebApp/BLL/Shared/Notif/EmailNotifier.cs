using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace BLL.Shared.Notif
{
    public interface IMailer
    {
        Task<IList<NotificationResponse>> NotifyAsync(ICollection<User> users, Notification notif);
    }
    public class EmailNotifier : IMailer
    {
        public string SmtpServer { get; set; }
        public int SmtpPort { get; set; }
        public string From { get; set; }
        public string Password { get; set; }
        public string[] To { get; set; }
        public string Subject { get; set; }
        public bool IsBodyHtml { get; set; }
        public string Body { get; set; }
        public bool IsSSL { get; set; }
        public static IList<SourceRecipient> SysRecipients { get; set; }
        private static int currentIndex;
        private static int trials;
        public static SourceRecipient CurrentRecipient
        {
            get
            {
                currentIndex = currentIndex == SysRecipients.Count - 1 ? 0 : currentIndex + 1;
                return SysRecipients[currentIndex];
            }
        }
        public async Task<IList<NotificationResponse>> NotifyAsync(ICollection<User> users, Notification notif)
        {
            IList<NotificationResponse> responses = new List<NotificationResponse>();
            foreach (User user in users)
            {
                responses.Add(await NotifyAsync(user, notif));
            }

            return await Task.FromResult(responses);
        }
        public async Task<NotificationResponse> NotifyAsync(User user, Notification notif)
        {
            SourceRecipient current = CurrentRecipient;
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(current.Name, current.Address));
                message.To.Add(new MailboxAddress(user.Email));
                message.Subject = notif.Title;
                message.Body = new TextPart("html")
                {
                    Text = notif.Content
                };

                using (var client = new SmtpClient())
                {
                    client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                    //if (_env.IsDevelopment())
                    //{
                    //    await client.ConnectAsync(_smtpSettings.Server, _smtpSettings.Port, true);
                    //}
                    //else
                    //{
                    await client.ConnectAsync(current.SmtpServer, current.SmtpPort, SecureSocketOptions.StartTls);
                    //}

                    await client.AuthenticateAsync(current.Address, current.Password);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                }
                return await Task.FromResult(new NotificationResponse
                {
                    NotificationId = notif.Id,
                    UserId = user.UserId,
                    Status = 3//sent
                });
            }
            catch (Exception e)
            {
                //throw new InvalidOperationException(e.Message);
                if(trials < SysRecipients.Count)
                {
                    trials++;
                    return await NotifyAsync(user, notif);
                }
                trials = 0;
                return await Task.FromResult(new NotificationResponse
                {
                    NotificationId = notif.Id,
                    UserId = user.UserId,
                    Status = 2//ready
                });
            }
        }
        public IList<NotificationResponse> Notify(ICollection<User> users, Notification notif)
        {
            IList<NotificationResponse> responses = new List<NotificationResponse>();
            foreach (User user in users)
            {
                SourceRecipient current = CurrentRecipient;
                try
                {
                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress(current.Name, current.Address));
                    message.To.Add(new MailboxAddress(user.Email));
                    message.Subject = notif.Title;
                    message.Body = new TextPart("html")
                    {
                        Text = notif.Content
                    };

                    using (var client = new SmtpClient())
                    {
                        client.ServerCertificateValidationCallback = (s, c, h, e) => true;

                        //if (_env.IsDevelopment())
                        //{
                        //    client.Connect(_smtpSettings.Server, _smtpSettings.Port, true);
                        //}
                        //else
                        //{
                        client.Connect(current.SmtpServer, current.SmtpPort);
                        //}

                        client.Authenticate(current.Address, current.Password);
                        client.Send(message);
                        client.Disconnect(true);
                        responses.Add(new NotificationResponse
                        {
                            NotificationId = notif.Id,
                            UserId = user.UserId,
                            Status = 3//sent
                        });
                    }
                }
                catch (Exception e)
                {
                    //throw new InvalidOperationException(e.Message);
                    responses.Add(new NotificationResponse
                    {
                        NotificationId = notif.Id,
                        UserId = user.UserId,
                        Status = 2//ready
                    });
                }
            }

            return responses;
        }
        /*
     public bool Notify(ICollection<User> users, Notification notif)
     {

         foreach (User user in users)
         {
             SourceRecipient current = CurrentRecipient;
             try
             {
                 MailMessage message = new MailMessage();
                 SmtpClient smtp = new SmtpClient();
                 message.From = new MailAddress(current.Address);// this.From);
                 message.To.Add(new MailAddress(user.Email));
                 message.Subject = notif.Title;
                 message.IsBodyHtml = this.IsBodyHtml;
                 message.Body = notif.Content;
                 smtp.Port = current.SmtpPort;// this.SmtpPort;
                 smtp.Host = current.SmtpServer;// this.SmtpServer;  
                 smtp.EnableSsl = this.IsSSL;
                 smtp.UseDefaultCredentials = false;
                 smtp.Credentials = new NetworkCredential(current.Address, current.Password);// this.From, this.Password);
                 smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                 smtp.Send(message);
             }
             catch (Exception ex)
             {
                 return false;
             }
         }
         return true;
     }*/
        public bool NotifyTogether(ICollection<User> users)
        {
            SourceRecipient current = CurrentRecipient;
            /*
                    try
                    {
                        MailMessage message = new MailMessage();
                        SmtpClient smtp = new SmtpClient();
                        message.From = new MailAddress(current.Address);// this.From);
                        Array.ForEach(users.ToArray<User>(), t => message.To.Add(new MailAddress(t.Email)));
                        message.Subject = this.Subject;
                        message.IsBodyHtml = this.IsBodyHtml;
                        message.Body = this.Body;
                        smtp.Port = current.SmtpPort;// this.SmtpPort;
                        smtp.Host = current.SmtpServer;// this.SmtpServer;  
                        smtp.EnableSsl = this.IsSSL;
                        smtp.UseDefaultCredentials = false;
                        smtp.Credentials = new NetworkCredential(current.Address, current.Password);// this.From, this.Password);
                        smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                        smtp.Send(message);
                    }
                    catch (Exception ex)
                    {
                        return false;
                    }*/
            return true;
        }
        public bool Notify()
        {
            try
            {
                System.Net.Mail.MailMessage message = new System.Net.Mail.MailMessage();
                System.Net.Mail.SmtpClient smtp = new System.Net.Mail.SmtpClient();
                message.From = new System.Net.Mail.MailAddress(this.From);
                Array.ForEach(this.To, t => message.To.Add(new System.Net.Mail.MailAddress(t)));
                message.Subject = this.Subject;
                message.IsBodyHtml = this.IsBodyHtml;
                message.Body = this.Body;
                smtp.Port = this.SmtpPort;
                smtp.Host = this.SmtpServer;
                smtp.EnableSsl = this.IsSSL;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new System.Net.NetworkCredential(this.From, this.Password);
                smtp.DeliveryMethod = System.Net.Mail.SmtpDeliveryMethod.Network;
                smtp.Send(message);
            }
            catch (Exception)
            {
                return false;
            }

            return true;
        }
    }
}
