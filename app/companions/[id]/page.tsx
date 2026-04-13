import React from 'react'

// [id] 경로에서는 params를 통해 ID 값을 받아올 수 있습니다.
const CompanionSessionPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">컴패니언 세션 페이지</h1>
      <p className="mt-4">현재 접속한 ID: <span className="text-blue-600 font-bold">{params.id}</span></p>
      <div className="mt-6 p-4 border rounded-lg bg-gray-50">
        여기에 {params.id}님과의 대화 내용을 구성하면 됩니다.
      </div>
    </div>
  )
}

export default CompanionSessionPage
