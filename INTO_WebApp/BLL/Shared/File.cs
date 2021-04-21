using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using static BLL.Shared.Graphics.Display;
using BLL.Shared.Attributes;

namespace BLL.Shared
{
        [Data("Id")]
    public class File : DataEntity<DataEntityCache<File>, File>
    {
        public File() : base() { }
        public File(SqlDataReader reader, string prefix = null) : base(reader, prefix) { }
        [GridSettings(DataVisibility.Invisible)]
        public long Id { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public long? UserId { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public string Name { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string Path { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string DeviceName { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string DeviceIP { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string DevicePhysicalAddress { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string VirtualPath { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public long Size { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string Type { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string Description { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public string Privacy { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        [JsonProperty("sourceType")]
        public int? IntSourceType { get { return (int)this.SourceType; } set { this.SourceType = value > 0 ? (FileSourceType)value : FileSourceType.Unknown; } }
        [GridSettings(DataVisibility.Invisible)]
        [JsonIgnore]
        public FileSourceType SourceType { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public long? Source { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool ReadOnly { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public Folder Parent { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public DateTime? ExpiryDate { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public DateTime DateUploaded { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public DateTime? DateCreated { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public DateTime? DateModified { get; set; }
        public override DataEntityCache<File> Cache(DataEntityCache<File> cache = null)
        {
            throw new NotImplementedException();
        }

        public override void Set(SqlDataReader reader, string prefix = null)
        {
            this.Id = Convert.ToInt64(reader["Id"]);
            this.UserId = reader["UserId"] != DBNull.Value ? Convert.ToInt64(reader["UserId"]) : default(long?);
            this.Name = reader["Name"].ToString();
            this.Path = reader["Path"].ToString();
            this.VirtualPath = reader["VirtualPath"].ToString();
            this.Size = Convert.ToInt64(reader["Size"]);
            this.Type = reader["Type"] != DBNull.Value ? reader["Type"].ToString() : null;
            this.Description = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : null;
            this.Privacy = reader["Privacy"] != DBNull.Value ? reader["Privacy"].ToString() : null;
            this.IntSourceType = reader["SourceType"] != DBNull.Value ? Convert.ToInt32(reader["SourceType"]) : default(int?);
            this.Source = reader["SourceId"] != DBNull.Value ? Convert.ToInt64(reader["SourceId"]) : default(long?);
            this.ReadOnly = Convert.ToBoolean(reader["ReadOnly"]);
            this.Parent = new Folder
            {
                Id = reader["Parent"] != DBNull.Value ? Convert.ToInt64(reader["Parent"]) : default(long)
            };
            this.ExpiryDate = reader["ExpiryDate"] != DBNull.Value ? Convert.ToDateTime(reader["ExpiryDate"]) : default(DateTime?);
            this.DateUploaded = Convert.ToDateTime(reader["DateUploaded"]);
            this.DateCreated = reader["DateCreated"] != DBNull.Value ? Convert.ToDateTime(reader["DateCreated"]) : default(DateTime?);
            this.DateModified = reader["DateModified"] != DBNull.Value ? Convert.ToDateTime(reader["DateModified"]) : default(DateTime?);
        }
        public enum FileSourceType
        {
            Unknown = 0,
            System = 100175,
            Email = 100176,
            Manual = 100177,
            BackgroundCheck = 100178,
            Resume = 100179
        }
    }
}
