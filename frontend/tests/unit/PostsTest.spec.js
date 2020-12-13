import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";
import { all } from '../../../backend/sqlite/connection';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    it('Renders right amount of posts', function () {
        const count = wrapper.findAll('.post')
        expect(count.length).toBe(testData.length)
    });
});

describe('MediaProperty', () => {
  
    const wrapper = mount(Posts, {router, store, localVue});

    it('Renders images correctly', function() {
        const count = wrapper.findAll('.post-image > img')
        const testCount = testData.filter(post => post.media && post.media.type == 'image')
        expect(count.length).toBe(testCount.length)
    });

    it('Renders videos correctly', function() {
        const count = wrapper.findAll('.post-image > video')
        const testCount = testData.filter(post => post.media && post.media.type == 'video')
        expect(count.length).toBe(testCount.length)
    });

    it('Renders absent media correctly', function() {
        const countMedia = wrapper.findAll('.post-image');
        const allPosts = wrapper.findAll('.post')
        const testAbsent = testData.filter(post => !post.media)
        expect(testAbsent.length).toBe(allPosts.length-countMedia.length)
    });

});

describe('PostTime', () =>  {


    const wrapper = mount(Posts, {router, store, localVue});
    var moment = require('moment');

    for (const post of testData) {
        const date = moment(post.createTime).format('LLLL');
        it('Post time is displayed in correct format', function() {
            let createTime = wrapper.find('.post-author > small');
            expect(createTime.html()).toContain(date);
        });
    }

});