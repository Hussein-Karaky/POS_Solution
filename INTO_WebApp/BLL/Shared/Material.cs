using BLL.Shared.Attributes;
using BLL.Tutor;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using static BLL.Shared.Graphics.Display;

namespace BLL.Shared
{
    [Data("sysId")]
    public class Material : DataEntity<DataEntityCache<Material>, Material>, IComparable<Material>
    {
        public Material() : base() { }
        public Material(SqlDataReader reader, string prefix = null) : base(reader, prefix) { }
    
        [GridSettings(DataVisibility.Invisible)]
        public int SysId { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public int Id { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public string Name { get; set; }
        [GridSettings(DataVisibility.Invisible)]
        public bool Passed { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public bool Approved { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public Subject Subject { get; set; }
        [GridSettings(DataVisibility.Screen480To599)]
        public Curriculum Curriculum { get; set; }
        [GridSettings(DataVisibility.Screen600To767)]
        public ScholarCycle Cycle { get; set; }
        [GridSettings(DataVisibility.Screen600To767)]
        public InstituteType InstituteType { get; set; }
        [GridSettings(DataVisibility.Visible)]
        public bool Active { get; set; }
        [GridSettings(DataVisibility.Screen479)]
        public int Certified { get; set; }
        [GridSettings(DataVisibility.Screen768To959)]
        public byte Points { get; set; }
        public IList<TutorRate> Pricing { get; set; } = new List<TutorRate>();

        public override DataEntityCache<Material> Cache(DataEntityCache<Material> cache = null)
        {
            throw new System.NotImplementedException();
        }

        public override void Set(SqlDataReader rdr, string prefix = null)
        {
            base.Set(rdr, prefix);
            if(rdr["MaterialSysId"] != DBNull.Value)
            {
                this.SysId = Convert.ToInt32(rdr["MaterialSysId"]);
                this.Name = rdr["MaterialName"] != DBNull.Value ? rdr["MaterialName"].ToString() : null;
                this.Subject = new Subject
                {
                    Name = rdr["SubjectName"] != DBNull.Value ? rdr["SubjectName"].ToString() : null
                };
            }
        }

        public override bool Equals(object obj)
        {
            return obj is Material ? ((Material)obj).SysId == this.SysId : false;
        }

        public int CompareTo(Material other)
        {
            return this.SysId.CompareTo(other.SysId);
        }
    }
}
