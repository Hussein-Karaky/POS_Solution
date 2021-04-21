using BLL.Shared.Attributes;
using BLL.Shared.Auth;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Net.Http.Headers;
using static BLL.Shared.Graphics.Display;

namespace BLL.Shared
{
    [Data("userId")]
    //[JsonObject(MemberSerialization.OptIn)]
    public class User : DataEntity<UserCache, User>
    {
        public User() : base() { }
        public User(EntityType type) : base() { this.Type = type; }
        public User(EntityType type, SqlDataReader reader, string prefix = null) : base(reader, prefix)
        {
            this.Type = type;
        }
        public User(SqlDataReader reader, string prefix = "U") : this(EntityType.Anonymous, reader, prefix) { }
        [GridSettings(DataVisibility.Invisible)]
        public long UserId { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string FirstName { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string LastName { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public string Name { get { return this.FirstName != null ? string.Concat(this.FirstName.ToCharArray()[0], '.', this.LastName) : null; } }
        [GridSettings(DataVisibility.Invisible)]
        public string Email { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool Gender { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public DateTime? DOB { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string SecondaryEmail { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string Password { get; set; }
        public string Phone { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string SecondaryPhone { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string Picture { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public string MiniPic { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public Language Language { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public LocationSettings LocationSettings = new LocationSettings
        {
            Country = new Country(),
            Location = new Location()
        };
        [GridSettings(DataVisibility.Invisible)]
        public bool? Active { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool? Internal { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public IList<NotificationPreference> NotificationPreferences { get; set; }
        [GridSettings(DataVisibility.Visible)]
        [JsonProperty("entityType")]
        public byte JsonType {
            get {
                return (byte)Type;
            }
            set {
                if (value >= 0 && value <= 4) {
                    Type = (EntityType)value;
                } else {
                    Type = EntityType.Student;
                }
            }
        }
        [GridSettings(DataVisibility.Invisible)]
        [JsonIgnore]
        public EntityType Type { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string ActivationCode { get; set; }
        [GridSettings(DataVisibility.Screen768To959)]
        public byte Potential { get; set; }
        [GridSettings(DataVisibility.Screen768To959)]
        public DateTime DateJoined { get; set; }
        [GridSettings(DataVisibility.Screen600To767)]
        public DateTime LastVisit { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public DateTime LastUpdated { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public RegistrationStep CurrentStep { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool BgCheckSubmitted { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool BgCheckApproved { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public long? BgCheckApprovedBy { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public DateTime? BgCheckApprovedOn { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool CVSubmitted { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool CVApproved { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public long? CVApprovedBy { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public DateTime? CVApprovedOn { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool AgreedOnTerms { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public Role Role { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public bool Online { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public decimal? Rating { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public long Likes { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public long Reviews { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public long Shares { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public int TimezoneOffset { get; set; }

        public override void Set(SqlDataReader reader, string prefix = "U")
        {
            this.UserId = Convert.ToInt64(reader[string.Concat(prefix, "Id")]);
            this.JsonType = reader["EntityType"] != DBNull.Value ? Convert.ToByte(reader["EntityType"]) : 2;
            this.Active = Convert.ToBoolean(reader["Active"]);
            this.FirstName = reader["FirstName"].ToString();
            this.LastName = reader["LastName"].ToString();
            this.Email = reader["Email"].ToString();
            this.SecondaryEmail = reader["SecondaryEmail"].ToString();
            this.Password = reader["Password"].ToString();
            this.Gender = Convert.ToBoolean(reader["Gender"]);
            this.DOB = reader["DOB"] != DBNull.Value ? Convert.ToDateTime(reader["DOB"]) : default(DateTime?);
            this.Potential = Convert.ToByte(reader["Potential"]);
            this.Phone = reader["Phone"].ToString();
            this.SecondaryPhone = reader["SecondaryPhone"].ToString();
            //this.Picture = reader["ProfilePicture"].ToString();
            this.MiniPic = reader["MiniPicture"] != DBNull.Value ? reader["MiniPicture"].ToString() : null;
            this.LocationSettings = new LocationSettings(reader);
            this.DateJoined = Convert.ToDateTime(reader["DateJoined"]);
            this.Language = new Language(reader);
            this.LastVisit = Convert.ToDateTime(reader["LastVisit"]);
            this.LastUpdated = Convert.ToDateTime(reader["LastUpdated"]);
            this.Internal = Convert.ToBoolean(reader["Internal"]);
            this.ActivationCode = reader["ActivationCode"] != DBNull.Value ? reader["ActivationCode"].ToString() : null;
            this.BgCheckSubmitted = Convert.ToBoolean(reader["BgCheckSubmitted"]);
            this.BgCheckApproved = Convert.ToBoolean(reader["BgCheckApproved"]);
            this.BgCheckApprovedBy = reader["BgCheckApprovedBy"] != DBNull.Value ? Convert.ToInt64(reader["BgCheckApprovedBy"]) : default(long?);
            this.BgCheckApprovedOn = reader["BgCheckApprovedOn"] != DBNull.Value ? Convert.ToDateTime(reader["BgCheckApprovedOn"]) : default(DateTime?);
            this.CVSubmitted = Convert.ToBoolean(reader["CVSubmitted"]);
            this.CVApproved = Convert.ToBoolean(reader["CVApproved"]);
            this.CVApprovedBy = reader["CVApprovedBy"] != DBNull.Value ? Convert.ToInt64(reader["CVApprovedBy"]) : default(long?);
            this.CVApprovedOn = reader["CVApprovedOn"] != DBNull.Value ? Convert.ToDateTime(reader["CVApprovedOn"]) : default(DateTime?);
            this.AgreedOnTerms = Convert.ToBoolean(reader["AgreedOnTerms"]);
            this.Online = Convert.ToBoolean(reader["Online"]);
            this.Rating = reader["Rating"] != DBNull.Value ? Convert.ToDecimal(reader["Rating"]) : default(decimal?);
            this.Shares = Convert.ToInt64(reader["Shares"]);
            this.Likes = Convert.ToInt64(reader["Likes"]);
            this.Reviews = Convert.ToInt64(reader["Reviews"]);
            this.TimezoneOffset = Convert.ToInt32(reader["TimezoneOffset"]);
        }
        public override UserCache Cache(UserCache cache = null)
        {
            if (cache == null)
            {
                cache = new UserCache();
            }
            cache.UserId = this.UserId;
            cache.Email = this.Email;
            cache.Phone = this.Phone;
            cache.Password = this.Password;
            cache.FirstName = this.FirstName;
            cache.LastName = this.LastName;
            cache.Gender = this.Gender;
            cache.DOB = this.DOB;
            cache.SecondaryEmail = this.SecondaryEmail;
            cache.Language = this.Language;
            cache.Active = this.Active.HasValue && this.Active.Value;
            cache.Internal = this.Internal;
            cache.Type = this.JsonType;
            cache.CurrentStep = this.CurrentStep;
            cache.AgreedOnTerms = this.AgreedOnTerms;
            return cache;
        }

        public override bool IsValid()
        {
            return base.IsValid() && this.UserId > 0 && !string.IsNullOrEmpty(this.Email) && !string.IsNullOrEmpty(this.Password);
        }
    }

    public enum EntityType
    {
        Anonymous = 0,
        Tutor = 1,
        Student = 2,
        Parent = 3,
        School = 4
    }
}
