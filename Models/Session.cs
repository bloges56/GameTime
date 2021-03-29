using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GameTime.Models
{
    public class Session
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Title { get; set; }

        [Required]
        public DateTime Time { get; set; }

        [Required]
        [MaxLength(50)]
        public string Game { get; set; }

        [Required]
        public int OwnerId { get; set; }
        public User Owner { get; set; }

        public List<UserSession> UserSessions { get; set; }
    }
}
