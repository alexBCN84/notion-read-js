import fetch from 'node-fetch';
import { masterId, RowData, Blog, Post } from './types';
const masterId = transformStringIntoId('f058d64ad56b4f318ec58ddeb26625ff');

function transformStringIntoId(str: string): string {
    const subStr1 = str.substring(0, 8);
    const subStr2 = str.substring(8, 12);
    const subStr3 = str.substring(12, 16);
    const subStr4 = str.substring(16, 20);
    const subStr5 = str.substring(20);
    return `${subStr1}-${subStr2}-${subStr3}-${subStr4}-${subStr5}`
}

async function requestData(id : masterId = masterId): Promise<RowData | undefined> {
    const options = {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            'pageId': id,
            'limit':50,
            'cursor':{
                'stack':[[{
                    'table':'block','id':id,'index':0
                }]]},
            'chunkNumber':0,
            'verticalColumns':false
        })
    }
    
    try {
        const response = await fetch('https://www.notion.so/api/v3/loadPageChunk', options);
        const resJson = await response.json() as Promise<RowData>;
        return resJson
    } catch(error) {
        console.log(error);
    }
}

function transformEntryPage(data: RowData): Blog {
    const blog: Blog = {
        entryPage: {
            title: null,
            posts: []
        },
        posts: []
    }
    const { recordMap : { block } } = data;
    const blockKeys = Object.keys(block)
    blockKeys.forEach((key: string, i)  => {
        const entry = block[key];
        const content = entry.value.properties && entry.value.properties.title[0][0];
        const created = entry.value && entry.value.created_time;
        const edited = entry.value && entry.value.last_edited_time;
        if (i == 0) {
            blog.entryPage.title = content;
        } else {
            blog.entryPage.posts.push({
                id: key, 
                postTitle: content,
                created,
                edited
            })
        }
    });
    return blog;
}

async function getRowDataForPosts(data: Blog): Promise<Blog> {
    const { entryPage: { posts}  } = data;
    const postsRowData = await Promise.all(posts.map(async ({id}) => ({id, data: await requestData(id)})));
    postsRowData.forEach(postData => {
        const matchingPost: Post | undefined = posts.find(({id}) => postData.id === id)
        if(matchingPost) {
            matchingPost.postRowData = postData;
        }
    });
    return {...data, posts};
}

function getTextContentFromData(data: Blog) {
    const { posts } = data;
    const parsedPosts = posts
    .map(({ postRowData, id }) => {
        if (postRowData?.data) {
            return {[id] : Object.keys(postRowData.data.recordMap.block)
                .filter(key => key === id || key === masterId ? null : key)
                .filter(key => postRowData.data?.recordMap.block[key].value.properties)
                .map((key, index) => ({
                    text: postRowData.data?.recordMap.block[key].value.properties.title[0][0],
                    type: postRowData.data?.recordMap.block[key].value.type,
                    position: index
                }))
            }
        }
    });
    return {...data, posts: parsedPosts};
}

// (async() => {
//     const data = await requestData();
//     if (data) {
//         const blogEntryPage: Blog = transformEntryPage(data);
//         const postsWithRowData: Blog = await getRowDataForPosts(blogEntryPage);
//         const transformedPosts = getTextContentFromData(postsWithRowData)
//         console.log(JSON.stringify(transformedPosts));
//     }
// })()

export async function retrieveNotionData(){
    const data = await requestData();
    if (data) {
        const blogEntryPage: Blog = transformEntryPage(data);
        const postsWithRowData: Blog = await getRowDataForPosts(blogEntryPage);
        const transformedPosts = getTextContentFromData(postsWithRowData)
        return transformedPosts; 
    }
    throw new Error('no data was retrieved');
}