# **App Name**: Headttrick Kizaru

## Core Features:

- User Authentication & Session Management: Custom username/password authentication and validation against Firestore user data, secure session persistence, and user logout functionality.
- User Account Status Enforcement: During login, verifies the 'ativo' status of the user from Firestore to restrict access for deactivated accounts and displays a custom message.
- Interactive Dashboard & Navigation: Displays the logged-in username, provides a collapsible side menu for navigation and logout, and presents the main 'PAINEL' content area with key functionalities.
- Dynamic Action Buttons with Visual Effects: Four prominent action buttons ('Remover Tremedeira', 'Estabilizar Mira', 'Sensi Sem Congelamento', 'Clean') featuring a purple neon glow effect and an engaging 'script-running' terminal-style animation upon interaction, simulating process execution.
- External Game Launch Integration: A dedicated button to attempt launching the 'Free Fire' mobile application via deep linking, with an automatic fallback redirect to its Google Play Store page if the deep link fails.

## Style Guidelines:

- Primary color: Vibrant purple (#C44CFF) for the application's core identity and interactive elements, capturing a modern, energetic, and 'neon gamer' aesthetic that pops on dark backgrounds.
- Background color: A dark, desaturated grayish-purple (#171418) that serves as the immersive base of the interface, providing depth and ensuring high contrast for foreground elements.
- Accent color: A bright, electric cyan-blue (#ACE4FF) used for secondary highlights, button glows, and to provide striking contrast, reinforcing the neon and futuristic visual theme.
- Main font: 'Space Grotesk' (sans-serif) is recommended for all text elements. Its contemporary, technical, and slightly futuristic feel perfectly aligns with the app's modern, gamer, and minimalist style.
- Icons should be minimalist, linear, and sharp, ensuring they are easily recognizable and maintain visual consistency with the app's modern and clean interface. Use a standard hamburger icon for the menu.
- Mobile-first, responsive design approach, ensuring a beautiful and fluid experience across diverse screen sizes for both Android and iOS. Focus on clear content hierarchy and intuitive touch interactions.
- Implement subtle and smooth transition animations for UI state changes, dynamic purple glow effects on interactive buttons, and a prominent 'terminal digital' script animation for visual feedback during process activation.