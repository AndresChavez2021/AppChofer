import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Inicio from "../../Screen/Chofer/Inicio";
import Mapa from "../../Screen/Chofer/Mapa";
import Rutas from "../../Screen/Chofer/Rutas";
import { useAuth } from "../../Providers/AuthProviders";
import { Text, TouchableOpacity } from "react-native";
import { showToast } from "../../Components/funciones";
import { logout } from "../../Services/AuthService";


const ChoferStacks = createNativeStackNavigator();


const ChoferStack = () => {

	const { handleLogout } = useAuth();

	async function CerrarSession() {
		try {
			showToast("Hasta la proxima", "#1abc9c");
			await logout();
			await handleLogout();
		} catch (e) {
			console.log("DESDE CIERR SESSION", e)
		}
	}

	return (
		<ChoferStacks.Navigator initialRouteName="Inicio">

			<ChoferStacks.Screen
				name="Inicio"
				component={Inicio}
				options={{
					headerShown: true,
					headerTitle: "Bienvenido",
					headerBackVisible: false,
					
					headerLeft: () => (
						<TouchableOpacity
							style={{
								marginLeft: 3, backgroundColor: '#f00',
								padding: 8,
								borderRadius: 5
							}}
							onPress={() => CerrarSession()}
						>
							<Text style={{ color: '#fff', }}>Salir</Text>
						</TouchableOpacity>
					),

				}}
			/>
			<ChoferStacks.Screen
				name="Rutas"
				component={Rutas}
				options={{ headerShown: false, headerTitle: "Rutas", headerBackVisible: false }}
			/>
			<ChoferStacks.Screen
				name="Mapa"
				component={Mapa}
				options={{ headerShown: false, headerTitle: "Ruta", headerBackVisible: false }}
			/>
		</ChoferStacks.Navigator>
	);
};

export default ChoferStack;
