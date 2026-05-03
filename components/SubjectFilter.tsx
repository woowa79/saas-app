"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { formUrlQuery } from "@/lib/utils";
import { subjects } from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SubjectFilterProps {
  className?: string
}

const SubjectFilter = ({ className }: SubjectFilterProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSubject = searchParams.get("subject") || "all"
  const [subject, setSubject] = React.useState(currentSubject)

  React.useEffect(() => {
    setSubject(currentSubject)
  }, [currentSubject])

  const handleSubjectChange = (value: string) => {
    setSubject(value)

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "subject",
      value: value === "all" ? "" : value,
    })

    router.push(newUrl, { scroll: false })
  }

  return (
    <div className={className}>
      <Select onValueChange={handleSubjectChange} value={subject}>
        <SelectTrigger className="input capitalize">
          <SelectValue placeholder="Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All subjects</SelectItem>
          {subjects.map((item) => (
            <SelectItem key={item} value={item} className="capitalize">
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export { SubjectFilter }