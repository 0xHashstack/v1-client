import PageCard from '@/components/layouts/pageCard';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
	return <PageCard>{children}</PageCard>;
}

export default layout;
