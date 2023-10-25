import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import Link from 'next/link'
import Button from '@/components/Button'
import axios from '@/lib/axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AuthSessionStatus from '@/components/AuthSessionStatus'
export async function getServerSideProps() {
    const res = await fetch(`http://localhost:8000/api/posts`)
    const data = await res.json()
    return { props: { data } }
}
export default function Index({ data }) {
	const [errors, setErrors] = useState([])
	const [status, setStatus] = useState(null)
	const router = useRouter()
    useEffect(() => {
        if (router.query.status?.length > 0 && errors.length === 0) {
            setStatus(router.query.status)
        } else {
            setStatus(null)
        }
    })
	const del = (id) => {axios.delete(`/api/posts/${id}`)
        .then(res => {
			router.push({
				pathname:`/posts`,
				query:{ status: res.data.status }
				},'/posts')
			})
        .catch(error => {
                if (error.response.status !== 422) throw error
                setErrors(error.response.data.errors)
            })
	}
	const edit = (id) => {axios.get(`/api/posts/${id}/edit`)
	.then(res => {
		router.push({
			pathname:`/posts/edit`,
			query:{ id: res.data.id, title: res.data.title, content:res.data.content }
		},'/posts/edit')
	})}
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
            <AuthSessionStatus className="bg-gray-300 font-bold text-blue-900 p-1 m-2" status={status} />
            <div className="m-6">
				<Link href="/posts/create" className="py-2 px-4 m-4 bg-gray-50 text-gray-600 font-bold border border-gray-400 hover:bg-white hover:drop-shadow-md rounded-md">Create Post</Link>
            </div>
			<div className="bg-white rounded-md overflow-x-auto m-6 drop-shadow-lg">
				<table className="w-full whitespace-nowrap">
					<thead>
						<tr className="bg-gray-500 text-white font-extrabold">
							<th className="px-4 py-1 border">Title</th>
							<th className="px-4 py-1 border">Content</th>
							<th className="px-4 py-1 border">Actions</th>
						</tr>
					</thead>
					<tbody>
						{data.map(post => (
						<tr key="post.id">
							<td className="px-4 py-1 border">{post.title}</td>
							<td className="px-4 py-1 border">{post.content}</td>
							<td className="px-4 py-1 border">
								<Button className="ml-4" onClick={()=>edit(post.id)}>Edit</Button>
								<Button className="ml-4 bg-red-600 hover:bg-red-500" onClick={()=>del(post.id)}>Delete</Button>
							</td>
						</tr>
						))}
					</tbody>
				</table>
			</div>
        </AppLayout>
    );
}