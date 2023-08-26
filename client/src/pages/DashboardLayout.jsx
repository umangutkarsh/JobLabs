import { createContext, useContext, useState } from 'react';
import { Outlet, redirect, useLoaderData } from 'react-router-dom';
import Wrapper from '../assets/wrappers/Dashboard';
import { BigSidebar, Navbar, SmallSidebar } from '../components';
import { checkDefaultTheme } from '../App';
import customFetch from '../utils/customFetch';

export const loader = async () => {
	try {
		const { data } = await customFetch.get('/users/current-user');
		return data;
	} catch (error) {
		redirect('/');
	}
};

const DashboardContext = createContext();

const DashboardLayout = () => {
	const { user } = useLoaderData();

	const [showSidebar, setShowSidebar] = useState(false);
	const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());

	const toggleDarkTheme = async () => {
		const newDarkTheme = !isDarkTheme;
		setIsDarkTheme(newDarkTheme);
		document.body.classList.toggle('dark-theme', newDarkTheme);
		localStorage.setItem('darkTheme', newDarkTheme);
	};

	const toggleSidebar = async () => {
		setShowSidebar(!showSidebar);
		console.log('toggled');
	};

	const logoutUser = async () => {
		console.log('logged out');
	};

	return (
		<DashboardContext.Provider
			value={{
				user,
				showSidebar,
				isDarkTheme,
				toggleDarkTheme,
				toggleSidebar,
				logoutUser,
			}}
		>
			<Wrapper>
				<main className='dashboard'>
					<SmallSidebar />
					<BigSidebar />
					<div>
						<Navbar />
						<div className='dashboard-page'>
							<Outlet context={{ user }} />
						</div>
					</div>
				</main>
			</Wrapper>
		</DashboardContext.Provider>
	);
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
