using GameTime.Models;
using GameTime.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;


namespace GameTime.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repo;
        public UserController(IUserRepository repo)
        {
            _repo = repo;
        }


        [HttpGet("{firebaseUserId}")]
        public IActionResult GetUserProfile(string firebaseUserId)
        {
            var user = _repo.GetByFirebaseUserId(firebaseUserId);
            if (user == null)
            {
                return NotFound();
            }

            if (user.IsActive == false)
            {
                return Unauthorized();
            }

            return Ok(user);
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _repo.GetAll();
           
            return Ok(users);
        }

        [HttpGet("find/{username}")]
        public IActionResult Get(string username)
        {
            var user = _repo.GetByUsername(username);
            if(user == null)
            {
                return BadRequest();
            }
            return Ok(user);
        }

        [HttpPost]
        public IActionResult Post(User userProfile)
        {
            _repo.Add(userProfile);
            return Ok(userProfile);
        }
    }
}
