using BLL.Tutor;
using System;
using System.Collections.Generic;
using System.Text;

namespace BLL.Shared
{
    public class User
    {
        public User() { }
        public User(EntityType type) { this.Type = type; }
        public static User CurrentUser {
            get {
                return new TutorProfile
                {
                    Id = 1,
                    UserId = 1,
                };
            }
        }
        public long UserId { set; get; }
        public string FirstName { set; get; }
        public string LastName { set; get; }
        public string Email { set; get; }
        public string SecondaryEmail { set; get; }
        public string Password { set; get; }
        public string Phone { set; get; }
        public string SecondaryPhone { set; get; }
        public Country Country { set; get; }
        public string Address { set; get; }
        public string SecondAddress { set; get; }
        public string City { set; get; }
        public decimal? Longitude { set; get; }
        public decimal? Latitude { set; get; }
        public float? TravelRadius { set; get; }
        public bool? IsBlocked { set; get; }
        public float? Active { set; get; }
        public float? Internal { set; get; }
        public IList<NotificationPreference> NotificationPreferences { set; get; }
        public EntityType Type { set; get; }
    }

    public enum EntityType
    {
        Tutor = 1,
        Student = 2,
        Parent = 3,
        School = 4
    }
}
