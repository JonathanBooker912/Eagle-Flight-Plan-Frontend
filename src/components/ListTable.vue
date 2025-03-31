<script setup>
import { watch } from "vue";
import { VRow, VCol, VCard } from "vuetify/components";

const emit = defineEmits([
  "update-filters",
  "clear-filters",
  "close-filter-menu",
  "close-info",
]);

// Props for number of items per row and items array
const props = defineProps({
  items: { type: Array, required: true },
  showFilters: Boolean,
  showInfo: Boolean,
  infoLabel: {
    type: String,
    default: "Info",
  },
  perRow: { type: Number, default: 4 },
  perRowLg: { type: Number, default: 3 },
  perRowMd: { type: Number, default: 2 },
  perRowSm: { type: Number, default: 1 },
  perRowXs: { type: Number, default: 1 },
});

watch(
  () => [props.showFilters, props.showInfo],
  ([newShowFilters, newShowInfo], [oldShowFilters, oldShowInfo]) => {
    if (oldShowInfo && newShowFilters) {
      emit("close-info");
    } else if (oldShowFilters && newShowInfo) {
      emit("close-filter-menu");
    }
  }
);

const handleClearFilters = () => {
  emit("clear-filters");
};
const handleUpdateFilters = () => {
  emit("update-filters");
};
const handleCloseFilters = () => {
  emit("close-filter-menu");
};
const handleCloseInfo = () => {
  emit("close-info");
};
</script>

<style scoped>
.scrollable-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-right: 4px; /* Prevent content from hiding under scrollbar */
  margin-top: 10px;
}

.filter-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-radius {
  border-radius: 25px;
}
</style>
