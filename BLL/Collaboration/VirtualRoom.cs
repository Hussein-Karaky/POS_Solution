using POS_Solutions.BLL.Shared.Collaboration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;

namespace POS_Solutions.BLL.Shared.Collaboration
{
    public class VirtualRoom : Event
    {
        public VirtualRoom() : base(EventType.VirtualRoom) { }
        public VirtualRoom(SqlDataReader reader, string prefix = null) : base(EventType.VirtualRoom, reader, prefix) { }
        public long? RoomId { get; set; }
        public DateTime? StartedOn { get; set; }
        public DateTime? EndedOn { get; set; }
    }
}
