import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import { useState } from 'react'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'
export default function Create() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [errors, setErrors] = useState([])
    const router = useRouter()
    const submitForm = event => {
        event.preventDefault()
        axios.post('/api/posts', {'title':title, 'content':content})
        .then(res => {router.push({
			pathname:`/posts`,
			query:{ status: res.data.status }
			},'/posts')})
        .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
    }
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Posts
                </h2>
            }>
            <Head>
                <title>Posts</title>
            </Head>
                <form onSubmit={submitForm}>
					<div className="flex flex-col justify-start items-center mt-6">
						<div>
							<Label htmlFor="title">Title</Label>
							<Input
								id="title"
								type="text"
								value={title}
								className="block mt-1 w-full"
								onChange={event => setTitle(event.target.value)}
								autoFocus
							/>
							<InputError messages={errors.title} className="mt-2" />
						</div>
						<div className="mt-4">
							<Label htmlFor="content">Content</Label>
							<Input
								id="content"
								type="text"
								value={content}
								className="block mt-1 w-full"
								onChange={event => setContent(event.target.value)}
							/>
							<InputError messages={errors.content} className="mt-2" />
						</div>
						<div className="flex items-center justify-end mt-4">
							<Button className="ml-4">Create</Button>
						</div>
					</div>
                </form>
        </AppLayout>
    );
}