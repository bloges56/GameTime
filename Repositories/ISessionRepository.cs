﻿using GameTime.Models;
using System.Collections.Generic;

namespace GameTime.Repositories
{
    public interface ISessionRepository
    {
        void Add(Session session);
        void Delete(Session session);
        List<Session> GetAll();
        List<Session> GetAllConfirmed(int userId);
        List<Session> GetAllUnConfirmed(int userId);
        Session GetById(int id);
        void Update(Session session);
    }
}