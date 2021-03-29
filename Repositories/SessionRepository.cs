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
                .ThenInclude(s => s.UserSessions)
                .Where(us => us.UserId == userId && us.IsConfirmed)
                .Where(us => us.Session.Time > DateTime.Now)
                .Select(us => us.Session)
                .ToList();
        }

        //return all the sessions from the database that have the matching userId and are unconfirmed
        public List<Session> GetAllUnConfirmed(int userId)
        {
            return _context.UserSession
                .Include(us => us.Session)
                .Where(us => us.UserId == userId && !us.IsConfirmed)
                .Where(us => us.Session.Time > DateTime.Now)
                .Select(us => us.Session)
                .ToList();
        }

        //add a new session to the database
        public void Add(Session session)
        {
            _context.Add(session);
            _context.SaveChanges();
        }

        public Session GetById(int id)
        {
            return _context.Session.Where(s => s.Id == id).Include(s => s.UserSessions).ThenInclude(us => us.User).FirstOrDefault();
        }

        //edit a session in the database
        public void Update(Session session)
        {
            //check that the given session exits
            var original = GetById(session.Id);
            if(original == null)
            {
                return;
            }
            //detach from original session and update with new data
            _context.Entry(original).State = EntityState.Detached;
            _context.Entry(session).State = EntityState.Modified;
            _context.SaveChanges();
        }

        public List<Session> GetAll()
        {
            return _context.Session.ToList();
        }

        // remove a session and all related userSessions
        public void Delete(Session session)
        {
            var userSessions = _context.UserSession
                .Where(us => us.SessionId == session.Id)
                .ToList();
            _context.UserSession.RemoveRange(userSessions);

            _context.Session.Remove(session);
            _context.SaveChanges();
        }
    }
}
