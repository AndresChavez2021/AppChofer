import React, {
    useState,
    useEffect
} from 'react';
import { View, Text, RefreshControl, StyleSheet, FlatList } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { listaRutas, obtenerBarrios } from '../../Services/AuthService';
import { showToast } from '../../Components/funciones';

const Rutas = ({ navigation }) => {
    const [obtenerRutas, setobtenerRutas] = useState([])
    const [dataRuta, setDataRuta] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const [Barrios, setBarrios] = useState([])


   
    useEffect(() => {
        (async()=>{
            const listRutas = await listaRutas();
            setobtenerRutas(listRutas);
            const listBarrios = await obtenerBarrios();
            setBarrios(listBarrios)

        })()
    }, [])


    //Actualiza la lista de los CAMIONES
    const onRefresh = async () => {
        setRefreshing(true);
        showToast("Cargando...", "#2ecc71")

        try {
            const listRutas = await listaRutas();
            setobtenerRutas(listRutas);

        } catch (error) {
            console.error(error);
        } finally {
            setRefreshing(false);
        }
    };

    const [checkRuta, setcheckRuta] = useState(null);

    const toggleCheckBox = (item) => {
        if (checkRuta === item.id) {
            // Si el mismo checkbox está seleccionado, deseleccionarlo
            setcheckRuta(null);
        } else {
            // Si se selecciona un nuevo checkbox, deseleccionar el anterior y seleccionar el nuevo
            setcheckRuta(item.id);
        }
    };

    console.log("checkRuta ", checkRuta)


    const renderClassItem = ({ item }) => (
        <View style={styles.classItem}>
            <View style={styles.classContent}>
                <View style={[styles.card, { backgroundColor: "#FAFAD2" }]}>
                    <Text style={[styles.cardTitle, { fontWeight: "900" }]}>{item.nombreRuta}{"\n"}</Text>
                    <Text style={[styles.cardBody, { fontWeight: "700" }]}>Horarios: <Text style={{ fontWeight: "400" }}>{item.hora_inicio} - {item.hora_fin}</Text></Text>
                    <Text style={[styles.cardBody, { fontWeight: "700" }]}>Dias: <Text style={{ fontWeight: "400" }}>{item.dia_semana}</Text> </Text>
                    <Text style={[styles.cardBody, { fontWeight: "700" }]}>Distrito: <Text style={{ fontWeight: "400" }}>{item.nombreDistrito}</Text> </Text>
                    <Text style={[styles.cardBody, { fontWeight: "700" }]}>Zona: <Text style={{ fontWeight: "400" }}>{item.nombreZonas}</Text> </Text>

                    <CheckBox
                        checked={checkRuta === item.id}
                        onPress={() => { toggleCheckBox(item); setDataRuta(item) }}
                        center={true}
                    />

                </View>
            </View>
        </View>
    );

    renderItemSeparator = ({ item }) => (
        <View style={styles.separatorContainer}>
            <View style={styles.timelineLine}></View>

        </View>
    )

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Rutas</Text>

                <FlatList
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                    ItemSeparatorComponent={renderItemSeparator}
                    data={obtenerRutas}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    renderItem={renderClassItem}
                    keyExtractor={(item, index) => index.toString()}
                />

                <Button

                    title="Enviar"
                    buttonStyle={{ backgroundColor: "#00b894", alignSelf: "center", width: "80%", height: 50, bottom: 10 }}
                    onPress={() => navigation.navigate("Mapa", { id_ruta: checkRuta, dataRuta: dataRuta ,barrios:Barrios})}
                />
            </View>



        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: "#fff"

    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        marginLeft: 16,
        color: "#00b894"
    },
    card: {
        flex: 1,
        backgroundColor: '#ff7f50',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        padding: 16,


    },
    header: {
        marginBottom: 8,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 12,
        color: '#ffffff',
    },
    body: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },


    classItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

    },
    timelineContainer: {
        width: 30,
        alignItems: 'center',
    },
    separatorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    timelineLine: {
        flex: 1,
        width: 8,
        height: 60,
        backgroundColor: '#00b894',

        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,

    },
    classContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },


    cardTitle: {
        fontSize: 18,
        color: '#00008B',
        marginBottom: 4,
        textAlign: 'center',
    },
    cardBody: {
        fontSize: 12,
        color: '#00008B',
        marginBottom: 8,
        left: 8
    },
    studentListContainer: {
        marginRight: 10,
    },
    studentAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginLeft: -3,
        borderWidth: 1,
        borderColor: '#fff'
    },
});

export default Rutas;