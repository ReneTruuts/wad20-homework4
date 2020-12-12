const express = require('express');
const router = express.Router();
const authorize = require('../middlewares/authorize');
const PostModel = require('../models/PostModel');


router.get('/', authorize, (request, response) => {

    // Endpoint to get posts of people that currently logged in user follows or their own posts

    PostModel.getAllForUser(request.currentUser.id, (postIds) => {

        if (postIds.length) {
            PostModel.getByIds(postIds, request.currentUser.id, (posts) => {
                response.status(201).json(posts)
            });
            return;
        }
        response.json([])
    })
});

router.post('/', authorize,  (request, response) => {
    // Endpoint to create a new post

    const post = request.body;
    const userId = request.currentUser.id;

    PostModel.create({userId, post},() => {
        response.status(201).json()
    })
});

router.put('/:postId/likes', authorize, (request, response) => {
    // Endpoint for current user to like a post

    const userId= request.currentUser.id;
    const postId = request.params.postId;

    PostModel.like(userId, postId, () => {
        response.status(200).json()
    })
});

router.delete('/:postId/likes', authorize, (request, response) => {
    // Endpoint for current user to unlike a post

    const userId= request.currentUser.id;
    const postId = request.params.postId;

    PostModel.unlike(userId, postId, () => {
        response.status(200).json()
    })
});

module.exports = router;
