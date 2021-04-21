using BLL.Shared.Attributes;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using static BLL.Shared.Graphics.Display;

namespace BLL.Shared.Collaboration
{
    [Data("id")]
    public class Event : DataEntity<DataEntityCache<Event>, Event>
    {
        public Event() : base() { }
        public Event(EventType type) : base() {
            this.Type = type;
        }
        public Event(EventType type, SqlDataReader reader, string prefix = null) : base(reader, prefix)
        {
            this.Type = type;
        }

        [GridSettings(DataVisibility.Invisible)]
        public long Id { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public EventType Type { get; set; } = EventType.VirtualRoom;//TODO: complete presistance
        [GridSettings(DataVisibility.Invisible)]
        public EventAccessLevel AccessLevel { get; set; } = EventAccessLevel.InvitedOnly;
        [GridSettings(DataVisibility.Visible)]
        public string Title { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string Description { get; set; }
        //[GridSettings(DataVisibility.Visible)]
        //public Material Material { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public User Host { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public DateTime DueDate { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public int Duration { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public string Password { get; set; }
        [GridSettings(DataVisibility.Screen768To959)]
        public DateTime? DateStarted { get; set; }
        [GridSettings(DataVisibility.Screen768To959)]
        public DateTime? DateEnded { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool Paid { get; set; }
        [GridSettings(DataVisibility.Screen768To959)]
        public bool Active { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool Running { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool StartsWithoutHost { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool Cancelled { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool UsesMathTools { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public IList<User> Participants { get; set; }
        public IList<long> Joined { get; set; }

        public override DataEntityCache<Event> Cache(DataEntityCache<Event> cache = null)
        {
            throw new NotImplementedException();
        }
        public override void Set(SqlDataReader rdr, string prefix = null)
        {
            base.Set(rdr, prefix);
        }

        public enum EventType
        {
            SimpleEvent = 0,
            VirtualRoom = 1
        }
        public enum EventAccessLevel
        {
            Public = 0,//explained: Any user on the system can join
            InvitedOnly = 1,
            InvitedOrSpecial = 2,//explained: Attendee must provide secret key received from host
            HostApproval = 3,//explained: Host gets a waitinglist for approval
            Password = 4,//explained: Password is set by the host as to be received though the invitation notification
            Friends = 5,
            Group = 6//explained: Host creates a group of specific attendees
        }
    }
}
