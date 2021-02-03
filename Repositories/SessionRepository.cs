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
            return _context.Session.Where(s => s.Id == id).FirstOrDefault();
        }

        public List<Session> GetAll()
        {
            return _context.Session.ToList();
        }
    }
}
