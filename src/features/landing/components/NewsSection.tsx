import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FadeInSection from '@/components/animations/FadeInSection';

interface NewsItem {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    image: string;
}

const mockNews: NewsItem[] = [
    {
        id: 1,
        title: 'IKH MYANGAN Launches Beta Testing Program',
        excerpt: 'We are excited to announce the launch of our beta testing program, inviting early adopters to experience the future of digital finance in Mongolia.',
        date: '2026-01-25',
        category: 'Announcement',
        image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop'
    },
    {
        id: 2,
        title: 'Partnership with Leading Mongolian Financial Institution',
        excerpt: 'Strategic partnership established to enhance regulatory compliance and expand service offerings across Mongolia.',
        date: '2026-01-20',
        category: 'Partnership',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop'
    },
    {
        id: 3,
        title: 'New Security Features: Multi-Factor Authentication',
        excerpt: 'Enhanced security measures implemented including advanced MFA options to protect user accounts and assets.',
        date: '2026-01-15',
        category: 'Security',
        image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop'
    },
    {
        id: 4,
        title: 'Quick Swap Feature Now Available',
        excerpt: 'Instantly swap between cryptocurrencies with our new Quick Swap feature - no order book required.',
        date: '2026-01-10',
        category: 'Product',
        image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=250&fit=crop'
    }
];

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Announcement':
            return 'bg-yellow-500/10 text-yellow-500';
        case 'Partnership':
            return 'bg-blue-500/10 text-blue-500';
        case 'Security':
            return 'bg-green-500/10 text-green-500';
        case 'Product':
            return 'bg-purple-500/10 text-purple-500';
        default:
            return 'bg-gray-500/10 text-gray-500';
    }
};

const NewsSection: React.FC = () => {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <FadeInSection>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Latest News & Updates
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Stay informed about the latest developments, features, and announcements from IKH MYANGAN
                            </p>
                        </div>
                    </FadeInSection>

                    {/* Featured Article */}
                    <FadeInSection delay={0.1}>
                        <div className="mb-8">
                            <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-colors">
                            <div className="grid md:grid-cols-2 gap-0">
                                <div className="h-64 md:h-auto bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 flex items-center justify-center">
                                    <img
                                        src={mockNews[0].image}
                                        alt={mockNews[0].title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                                <div className="p-8 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(mockNews[0].category)}`}>
                                            {mockNews[0].category}
                                        </span>
                                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(mockNews[0].date)}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-foreground mb-3">
                                        {mockNews[0].title}
                                    </h3>
                                    <p className="text-muted-foreground mb-6 leading-relaxed">
                                        {mockNews[0].excerpt}
                                    </p>
                                    <Button variant="outline" className="w-fit group">
                                        Read More
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </FadeInSection>

                    {/* Other Articles Grid */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {mockNews.slice(1).map((news, index) => (
                            <FadeInSection key={news.id} delay={0.15 * (index + 1)}>
                                <article className="bg-card border border-border rounded-xl overflow-hidden hover:border-yellow-500/50 transition-colors group cursor-pointer h-full">
                                    <div className="h-40 bg-gradient-to-br from-muted to-muted/50 overflow-hidden">
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
                                                {news.category}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(news.date)}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-yellow-500 transition-colors">
                                            {news.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {news.excerpt}
                                        </p>
                                    </div>
                                </article>
                            </FadeInSection>
                        ))}
                    </div>

                    {/* View All Button */}
                    <FadeInSection delay={0.5}>
                        <div className="text-center mt-10">
                            <Button variant="outline" size="lg" className="group">
                                View All News
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </FadeInSection>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
