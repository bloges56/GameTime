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

        //return true if a user session with the given userID and sessionId exists
        public bool Exists(int userId, int sessionId)
        {
            var userSession = _context.UserSession
                .Where(us => us.UserId == userId && us.SessionId == sessionId);
            return userSession.Count() >= 1;
        }

        // remove a userSession from the database
        public void Delete(UserSession userSession)
        {
            _context.UserSession.Remove(userSession);
            _context.SaveChanges();
        }

        // get a userSession by its id
        public UserSession GetById(int id)
        {
            return _context.UserSession
                .Where(us => us.Id == id)
                .Include(us => us.Session)
                .FirstOrDefault();
        }

        public UserSession GetByContent(int userId, int sessionId)
        {
            return _context.UserSession
                .Include(us => us.Session)
                .Where(us => us.UserId == userId && us.SessionId == sessionId)
                .FirstOrDefault();
        }

        public void Update(UserSession userSession)
        {
            _context.Entry(userSession).State = EntityState.Modified;
            _context.SaveChanges();
        }
    }
}
