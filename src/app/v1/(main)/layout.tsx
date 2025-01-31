import PageCard from '@/components/layouts/pageCard';
import React from 'react';

function layout({ children }: { children: React.ReactNode }) {
	return <PageCard pt='6.5rem'>{children}</PageCard>;
}

export default layout;
