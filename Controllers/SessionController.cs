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

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var currentUser = GetCurrentUserProfile();
            var users = _userSessionRepo.Get(currentUser.Id, id);

            // check that the session exists
            var session = _sessionRepo.GetById(id);
            if(session == null)
            {
                return BadRequest();
            }

            // make sure that the current user has either been invited to the sesison or is the session owner
            if(!users.Contains(currentUser) && session.OwnerId != currentUser.Id)
            {
                return Unauthorized();
            }

            return Ok(session);
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

        // update a given session
        [HttpPut("{id}")]
        public IActionResult Update(Session session, int id)
        {
            //check that the given id matches the given session
            if(id != session.Id)
            {
                return BadRequest();
            }

            var originalSession = _sessionRepo.GetById(id);
            //check that the current user is also the owner of the session
            var currentUser = GetCurrentUserProfile();
            if(currentUser.Id != originalSession.OwnerId || currentUser.Id != session.OwnerId)
            {
                return Unauthorized();
            }

            _sessionRepo.Update(session);
            return NoContent();

        }

        // endpoint to delete a given session
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            //check that the given id is valid
            var session = _sessionRepo.GetById(id);
            if(session == null)
            {
                return BadRequest();
            }

            //check that the session's owner is the current user
            var currentUser = GetCurrentUserProfile();
            if(currentUser.Id != session.OwnerId)
            {
                return Unauthorized();
            }

            _sessionRepo.Delete(session);
            return NoContent();

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
