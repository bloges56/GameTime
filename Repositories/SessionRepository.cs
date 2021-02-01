using GameTime.Data;
using GameTime.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameTime.Repositories
{
    public class SessionRepository : ISessionRepository
    {
        private readonly ApplicationDbContext _context;

        public SessionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        //return all the sessions from the database that have the matching userId and are confirmed
        public List<Session> GetAllConfirmed(int userId)
        {
            return _context.UserSession
                .Include(us => us.Session)
                .Where(us => us.UserId == userId && us.IsConfirmed)
                .Select(us => us.Session)
                .ToList();
        }
    }
}
