using GameTime.Data;
using GameTime.Models;
using Microsoft.EntityFrameworkCore;
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

        //return all the users of a session
        public List<User> Get(int userId, int sessionId)
        {
            return _context.UserSession
                .Include(us => us.User)
                .Where(us => us.SessionId == sessionId && us.UserId != userId)
                .Select(us => us.User)
                .ToList();
        }

        //add a new user session to the repository
        public void Add(UserSession userSession)
        {
            _context.Add(userSession);
            _context.SaveChanges();
        }
    }
}
