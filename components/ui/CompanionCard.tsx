import Image from 'next/image';
import Link from 'next/link';

interface CompanionCardProps {
    id: string;
    name: string;
    topic: string;
    subject: string;
    duration: number;
    color: string;
}

const CompanionCard = ({id, name, topic, subject, duration, color}: CompanionCardProps) => {
    return (
        <article className="companion-card" style={{ backgroundColor: color }}>
            <div className="flex justify-between items-center">
                <div className="subject-badge">{subject}</div>
                <button className="p-1">
                    <Image src="/icons/bookmark.svg" alt="bookmark" width={12} height={15} />
                </button>
            </div>
            
            <h2 className="text-xl font-bold mt-4 whitespace-nowrap">{name}</h2>
            <p className="text-sm opacity-80 whitespace-nowrap">{topic}</p>
            
            <div className="flex items-center gap-2 mt-4">
                <Image src="/icons/clock.svg" alt="duration" width={13} height={13} />
                <p className="text-sm">{duration} minutes</p>
            </div>

            <Link href={`/companions/${id}`} className="w-full mt-6 block">
                <button className="btn-primary w-full flex justify-center py-3 bg-black text-white rounded-lg">
                    View Profile
                </button>
            </Link>
        </article>
    );
}

export default CompanionCard;