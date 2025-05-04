import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVisualizarServicos } from "../hooks/useVisualizarServicos";
import { Servico } from "../models/servicoModel";

export default function VisualizarServicosScreen() {
  const { salaoId } = useLocalSearchParams() as { salaoId: string };
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [nomeFilter, setNomeFilter] = useState("");
  const [precoMinFilter, setPrecoMinFilter] = useState<number | "">("");
  const [precoMaxFilter, setPrecoMaxFilter] = useState<number | "">("");

  const [nomeInput, setNomeInput] = useState("");
  const [precoMinInput, setPrecoMinInput] = useState("");
  const [precoMaxInput, setPrecoMaxInput] = useState("");

  const { servicos, totalServicos, isLoading, error, handleEditarServico } =
    useVisualizarServicos(
      page,
      limit,
      salaoId,
      nomeFilter,
      precoMinFilter,
      precoMaxFilter
    );

  const hasMore = totalServicos > page * limit;

  const aplicarFiltros = () => {
    setPage(1);
    setNomeFilter(nomeInput);
    setPrecoMinFilter(precoMinInput === "" ? "" : Number(precoMinInput));
    setPrecoMaxFilter(precoMaxInput === "" ? "" : Number(precoMaxInput));
  };

  const handleEditarServicoPress = (id: string) => {
    handleEditarServico(id);
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => aplicarFiltros()}
        >
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Serviços do Salão {salaoId}</Text>

      <TextInput
        placeholder="Buscar por nome"
        value={nomeInput}
        onChangeText={setNomeInput}
        style={styles.input}
      />

      <View style={styles.filterRow}>
        <TextInput
          placeholder="Preço mínimo"
          value={precoMinInput}
          onChangeText={setPrecoMinInput}
          keyboardType="numeric"
          style={styles.inputHalf}
        />
        <TextInput
          placeholder="Preço máximo"
          value={precoMaxInput}
          onChangeText={setPrecoMaxInput}
          keyboardType="numeric"
          style={styles.inputHalf}
        />
      </View>

      <TouchableOpacity style={styles.applyButton} onPress={aplicarFiltros}>
        <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
      </TouchableOpacity>

      {isLoading && page === 1 ? (
        <ActivityIndicator size="large" color="#c62828" style={styles.loader} />
      ) : (
        <FlatList
          data={servicos}
          keyExtractor={(item) => item.id || Math.random().toString()}
          style={styles.list}
          renderItem={({ item }) => {
            console.log("Exibindo serviço:", item);
            return (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.Nome}</Text>
                <Text style={styles.cardDescription}>{item.Descricao}</Text>
                <Text style={styles.cardPrice}>
                  Preço Mín: R${" "}
                  {item.PrecoMin ? item.PrecoMin.toFixed(2) : "N/A"}
                </Text>
                <Text style={styles.cardPrice}>
                  Preço Máx: R${" "}
                  {item.PrecoMax ? item.PrecoMax.toFixed(2) : "N/A"}
                </Text>

                <TouchableOpacity
                  onPress={() => item.id && handleEditarServico(item.id)}
                  style={styles.editButton}
                >
                  <Ionicons name="create-outline" size={18} color="#d32f2f" />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
            );
          }}
          onEndReached={() => {
            if (hasMore && !isLoading) {
              setPage((prev) => prev + 1);
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum serviço encontrado.</Text>
            </View>
          )}
          ListFooterComponent={
            isLoading && page > 1 ? (
              <ActivityIndicator color="#c62828" style={styles.footerLoader} />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#c62828",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  filterRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  inputHalf: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  applyButton: {
    backgroundColor: "#c62828",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  list: {
    flex: 1,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: "#ef5350",
    borderRadius: 8,
    backgroundColor: "#fff8f8",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#b71c1c",
    marginBottom: 4,
  },
  cardDescription: {
    marginBottom: 8,
    color: "#333",
  },
  cardPrice: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  editButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
  },
  editButtonText: {
    color: "#d32f2f",
    fontWeight: "500",
  },
  loader: {
    marginTop: 32,
  },
  footerLoader: {
    margin: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#c62828",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#c62828",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
