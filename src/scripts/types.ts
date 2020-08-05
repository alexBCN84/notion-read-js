export type masterId = string;
type PostTitle = string;
type Created = string;
type Edited = string;
type Title = string | null;
type Id = string;
type Posts = Post [];

export interface Cursor {
    stack: [any];
}

export interface Properties {
    title: string [][],
}

export interface Value {
    properties: Properties;
    type: string;
    created_time: string;
    last_edited_time: string;
}

export interface Block {
    [key: string]: {
        value: Value
    }
}

export interface RowData {
    recordMap: {
        block: Block;
        space: object,
        notion_user: object
    },
    cursor: Cursor
} 

export interface Post {
    id: Id;
    postTitle: PostTitle;
    created: Created;
    edited: Edited;
    postRowData?: {
        id: Id,
        data: RowData | undefined;
    };
}

export interface EntryPage {
    posts: Posts;
    title: Title;
}

export interface Blog {
    entryPage: EntryPage;
    posts: Posts;
}