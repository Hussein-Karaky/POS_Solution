using BLL.Shared.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BLL.Shared.Graphics.Display;

namespace BLL.Shared.Struct
{
    public class DataObject : DataEntity<DataObjectCache, DataObject>
    {
        public DataObject() : base() { }
        public DataObject(SqlDataReader reader, string prefix = null) : base(reader, prefix) { }
        public long Id { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public string Name { get; set; }
        [JsonProperty("entityType")]
        public byte ByteType
        {
            get
            {
                return (byte)Type;
            }
            set
            {
                if (value >= 0 && value <= 4)
                {
                    Type = (EntityType)value;
                }
                else
                {
                    Type = EntityType.Student;
                }
            }
        }
        [GridSettings(DataVisibility.Invisible)]
        [JsonIgnore]
        public EntityType Type { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public string Picture { get; set; }
        public bool Liked { get; set; }
        public decimal Value { get; set; }
        public string Review { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public decimal? ObjId { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public decimal? ObjRating { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public long ObjLikes { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public long ObjReviews { get; set; }

        public override DataObjectCache Cache(DataObjectCache cache = null)
        {
            if (cache == null)
            {
                cache = new DataObjectCache();
            }
            cache.Id = this.Id;
            cache.Name = this.Name;
            cache.Type = this.ByteType;
            return cache;
        }

        public override void Set(SqlDataReader rdr, string prefix = null)
        {
            base.Set(rdr, prefix);
            this.Id = Convert.ToInt64(rdr[string.Concat(prefix, "Id")]);
            this.Name = rdr["Name"].ToString();
            this.ByteType = Convert.ToByte(rdr["ObjType"]);
            this.Picture = rdr["Picture"] != DBNull.Value ? rdr["Picture"].ToString() : null;
            this.Liked = Convert.ToBoolean(rdr["Liked"]);
            this.Value = Convert.ToDecimal(rdr["Value"]);
            this.Review = rdr["Review"] != DBNull.Value ? rdr["Review"].ToString() : null;
            this.ObjId = Convert.ToInt64(rdr["ObjId"]);
            this.ObjLikes = Convert.ToInt64(rdr["Likes"]);
            this.ObjRating = Convert.ToDecimal(rdr["Rating"]);
            this.ObjReviews = Convert.ToInt64(rdr["Reviews"]);
        }
    }
}
