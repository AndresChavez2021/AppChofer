import { View, StyleSheet, SafeAreaView,TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Text, Button, Image, Avatar } from "react-native-elements";
import Toast from "react-native-root-toast";

import { ActivityLoader, ErrorText } from "../../Components/Shared";
import { useForm } from "react-hook-form";
import { EmailInput, PasswordInput } from "../../Components/Inputs/index";
/* importando useAuth para el login */
import { useAuth } from "../../Providers/AuthProviders";
import { login } from "../../Services/AuthService";

import LottieView from "lottie-react-native";

const Login = ({ navigation }) => {
	const [Error, setError] = useState(null);
	const [loading, setloading] = useState(false);
	const { handleLogin } = useAuth();
	// proteccion de contraseña
	const [secureEntry, setSecureEntry] = useState(true);

	/* Errores de formulario */
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();

	//TODO: Iniciar sesion

	const login1 = async data => {
		try {
			setloading(true);
			const response = await login(data);
			await handleLogin(response.data);
			Toast.show(response.message);
		} catch (e) {
			setError(e.message);
			setloading(false);
		}
	};

	/* proteccion de contrasenia */

	const toggleSecureEntry = () => {
		setSecureEntry(!secureEntry);
	};

	return (
		<SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
			{loading === true ? <ActivityLoader /> : null}

			<View style={{ paddingHorizontal: 25 }}>
				<View style={{ alignItems: "center" }}>
					{/* portada */}
					<LottieView
						resizeMode={"cover"}
						style={{ width: 320, height: 230 ,}}
						source={require("../../Assets/json/basura.json")}
						autoPlay
					/>
				</View>

				<Text
					style={{
						// fontFamily: 'roboto-medium',
						fontSize: 28,
						fontWeight: "500",
						color: "#333",
						marginBottom: 30,
					}}>
					Login
				</Text>

				<ErrorText error={Error} />
				<EmailInput
					placeholder="Correo"
					name="email"
					control={control}
					errors={errors}
					errValiStyle={styles.errorValidacion}
					inputStyle={styles.input}
				/>

				<PasswordInput
					placeholder="Contraseña"
					name="password"
					control={control}
					errors={errors}
					errValiStyle={styles.errorValidacion}
					inputStyle={styles.input}
					secureEntry={secureEntry}
					toggleSecureEntry={toggleSecureEntry}
					
				/>

				<Button
					title="Acceder"
					type="outline"
					onPress={handleSubmit(login1)}
					titleStyle={{ color: "#00b894" }}
				/>

				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginBottom: 30,
					}}></View>

				
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffff",
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: "#2570e3",
		// fontFamily:'$400Regular',
		fontWeight: "600",
		fontSize: 24,
	},
	errorValidacion: {
		color: "#dd3333",
		fontSize: 12,
	},
	input: {
		color: "#000000",
	},
});

export default Login;
