using GameTime.Models;
using GameTime.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace GameTime.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SessionController : ControllerBase
    {
        private readonly ISessionRepository _sessionRepo;
        private readonly IUserRepository _userRepo;
        private readonly IUserSessionRepository _userSessionRepo;
        public SessionController(ISessionRepository sessionRepo, IUserRepository userRepo, IUserSessionRepository userSessionRepo)
        {
            _sessionRepo = sessionRepo;
            _userRepo = userRepo;
            _userSessionRepo = userSessionRepo;
        }

        
        [HttpGet("confirmed/{id}")]
        public IActionResult GetAllConfirmed(int id)
        {
            //check that the user with the given Id exists, is active, and is the current user
            var user = _userRepo.GetById(id);
            var currentUser = GetCurrentUserProfile();
            if (user == null)
            {
                return BadRequest();
            }
            if (user.IsActive == false || currentUser != user)
            {
                return Unauthorized();
            }

            //return the sessions using the repo method
            var sessions = _sessionRepo.GetAllConfirmed(id);
            return Ok(sessions);
        }

        [HttpGet("unconfirmed/{id}")]
        public IActionResult GetAllUnConfirmed(int id)
        {
            //check that the user with the given Id exists, is active, and is the current user
            var user = _userRepo.GetById(id);
            var currentUser = GetCurrentUserProfile();
            if (user == null)
            {
                return BadRequest();
            }
            if (user.IsActive == false || currentUser != user)
            {
                return Unauthorized();
            }

            //return the sessions using the repo method
            var sessions = _sessionRepo.GetAllUnConfirmed(id);
            return Ok(sessions);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_sessionRepo.GetAll());
        }

        //endpoint for posting a new session
        [HttpPost]
        public IActionResult Add(Session session)
        {
            // check that the session user both exists and is the current user
            var user = _userRepo.GetById(session.OwnerId);
            var currentUser = GetCurrentUserProfile();

            if(user == null)
            {
                return BadRequest();
            }

            if(user != currentUser)
            {
                return Unauthorized();
            }

           

            _sessionRepo.Add(session);

            //add a userSession for the owner
            UserSession userSession = new UserSession()
            {
                SessionId = session.Id,
                UserId = currentUser.Id,
                IsConfirmed = true
            };
            _userSessionRepo.Add(userSession);

            return Ok(session);
        }

        private User GetCurrentUserProfile()
        {
            try
            {
                var firebaseUserId = User.FindFirst(ClaimTypes.NameIdentifier).Value;
                return _userRepo.GetByFirebaseUserId(firebaseUserId);
            }
            catch
            {
                return null;
            }
        }
    }
}
