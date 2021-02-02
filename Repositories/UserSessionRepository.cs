using GameTime.Data;
using GameTime.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameTime.Repositories
{
    public class UserSessionRepository : IUserSessionRepository
    {
        private readonly ApplicationDbContext _context;

        public UserSessionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //add a new user session to the repository
        public void Add(UserSession userSession)
        {
            _context.Add(userSession);
            _context.SaveChanges();
        }
    }
}
