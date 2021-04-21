using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using static BLL.Shared.File;

namespace BLL.Shared
{
    public class Folder:DataEntity<DataEntityCache<Folder>, Folder>
    {
        public Folder() : base() { }
        public Folder(SqlDataReader reader, string prefix = null) : base(reader, prefix) { }
        public long Id { get; set; }
        public long? UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string VirtualPath { get; set; }
        public string Privacy { get; set; }
        public Folder Parent { get; set; }
        [JsonProperty("SourceType")]
        public int? IntSourceType { get { return (int)this.SourceType; } set { this.SourceType = value > 0 ? (FileSourceType)value : FileSourceType.Unknown; } }
        [JsonIgnore]
        public FileSourceType SourceType { get; set; }
        public long? Source { get; set; }
        public DateTime DateUploaded { get; set; }
        public DateTime? DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public override DataEntityCache<Folder> Cache(DataEntityCache<Folder> cache = null)
        {
            throw new NotImplementedException();
        }
        public override void Set(SqlDataReader reader, string prefix = null)
        {
            this.Id = Convert.ToInt64(reader["Id"]);
            this.UserId = reader["UserId"] != DBNull.Value ? Convert.ToInt64(reader["UserId"]) : default(long?);
            this.Name = reader["Name"].ToString();
            this.Description = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : null;
            this.VirtualPath = reader["VirtualPath"].ToString();
            this.Privacy = reader["Privacy"] != DBNull.Value ? reader["Privacy"].ToString() : null;
            this.IntSourceType = reader["SourceType"] != DBNull.Value ? Convert.ToInt32(reader["SourceType"]) : default(int?);
            this.Source = reader["SourceId"] != DBNull.Value ? Convert.ToInt64(reader["SourceId"]) : default(long?);
            this.Parent = new Folder(reader);
            this.DateUploaded = Convert.ToDateTime(reader["DateUploaded"]);
            this.DateCreated = reader["DateCreated"] != DBNull.Value ? Convert.ToDateTime(reader["DateCreated"]) : default(DateTime?);
            this.DateModified = reader["DateModified"] != DBNull.Value ? Convert.ToDateTime(reader["DateModified"]) : default(DateTime?);
        }

    }
}
