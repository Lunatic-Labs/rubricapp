import React from "react";
import Cookies from "universal-cookie";
import { Grid, IconButton, TextField, Tooltip, FormControl } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CustomButton from "./Components/CustomButton";
import ErrorMessage from "../../../Error/ErrorMessage";
import { genericResourcePOST, genericResourcePUT, genericResourceGET, genericResourceDELETE } from "../../../../utility";
import CustomDataTable from "../../../Components/CustomDataTable";
import CollapsableRubricCategoryTable from "./CollapsableRubricCategoryTable";
import ImageModal from "./CustomRubricModal";
import RubricDescriptionsImage from "../../../../RubricDetailedOverview.png";
import RubricDescriptionsImage2 from "../../../../RubricDetailedOverview2.png";
import Loading from '../../../Loading/Loading';
import FormHelperText from '@mui/material/FormHelperText';
import { Rubric } from "../../../../types/Rubric";
import { Category } from "../../../../types/Category";

interface AddCustomRubricProps {
    navbar: any;
    rubrics: Rubric[];
    categories: Category[];
    chosenCategoryJson: any;
    categoryMap: any;
    onError?: (error: string) => void;
    refreshData?: () => void;
}

interface AddCustomRubricState {
    categories: Category[];
    errorMessage: string | null;
    isLoaded: boolean | null;
    isHelpOpen: boolean;
    addCustomRubric: boolean;
    defaultRubrics: any;
    allCategories: any;
    rubrics: any;
    rubricName: string;  // Added
    rubricDescription: string;  // Added
    errors: {
        rubricName: string;
        rubricDescription: string;
        rubricCategories: string;
    };
}

class AddCustomRubric extends React.Component<AddCustomRubricProps, AddCustomRubricState> {
    handleCreateRubric: any;
    handleDeleteRubric: any;
    toggleHelp: any;
    handleChange: any;  // Added
    constructor(props: AddCustomRubricProps) {
        super(props);

        this.state = {
            categories: [],
            errorMessage: null,
            isLoaded: null,
            isHelpOpen: false,
            addCustomRubric: true,
            defaultRubrics: this.props.rubrics,
            allCategories: this.props.categories,
            rubrics: null,
            rubricName: this.props.navbar?.state?.addCustomRubric ? "" : this.props.rubrics?.rubric_name || "",  // Added
            rubricDescription: this.props.navbar?.state?.addCustomRubric ? "" : this.props.rubrics?.rubric_description || "",  // Added
            errors: {
                rubricName: '',
                rubricDescription: '',
                rubricCategories: '',
            }
        };

        this.toggleHelp = () => {
            this.setState({
                isHelpOpen: !this.state.isHelpOpen,
            });
        };

        this.handleCreateRubric = (pickedCategories: Category[]) => {
            var navbar = this.props.navbar;
            var rubricId = navbar.rubricId;
            var categoryIds = [];
            var rubricName = this.state.rubricName.trim();  // Use state instead of DOM
            var rubricDescription = this.state.rubricDescription.trim();  // Use state instead of DOM

            for (var categoryIndex = 0; categoryIndex < pickedCategories.length; categoryIndex++) {
                categoryIds.push(pickedCategories[categoryIndex]!["category_id"]);
            }

            // Check both fields and set errors for both if invalid
            const nameError = rubricName === "" ? "Missing New Rubric Name." : "";
            const descError = rubricDescription === "" ? "Missing New Rubric Description." : "";
            const categoryError = categoryIds.length === 0 ? "Missing categories, at least one category must be selected." : "";

            if (nameError || descError || categoryError) {
                this.setState({
                    errors: {
                        rubricName: nameError,
                        rubricDescription: descError,
                        rubricCategories: categoryError,
                    }
                });
                return;
            }

            // Clear errors if valid
            this.setState({
                errors: {
                    rubricName: "",
                    rubricDescription: "",
                    rubricCategories: "",
                }
            });

            var cookies = new Cookies();
            let promise;
            if (this.state.addCustomRubric === false) {
                promise = genericResourcePUT(
                    `/rubric?rubric_id=${rubricId}`,
                    this,
                    JSON.stringify({
                        rubric: {
                            rubric_name: rubricName,
                            rubric_description: rubricDescription,
                            owner: cookies.get("user")["user_id"],
                        },
                        categories: categoryIds,
                    }),
                );
            } else {
                promise = genericResourcePOST(
                    `/rubric`,
                    this,
                    JSON.stringify({
                        rubric: {
                            rubric_name: rubricName,
                            rubric_description: rubricDescription,
                            owner: cookies.get("user")["user_id"],
                        },
                        categories: categoryIds,
                    }),
                );
            }
            
            promise.then(result => {
                if (result !== undefined && result.errorMessage === null) {
                    this.props.navbar.confirmCreateResource("MyCustomRubrics");
                }
            });
        };

        // Added handleChange
        this.handleChange = (e: any) => {
            const { id, value } = e.target;
            let errorMessage = '';
            if (value.trim() === '') {
                errorMessage = `${id === 'rubricNameInput' ? 'Rubric Name' : 'Rubric Description'} cannot be empty`;
            }
            this.setState({
                [id.replace('Input', '')]: value,  // Maps 'rubricNameInput' to 'rubricName', etc.
                errors: {
                    ...this.state.errors,
                    [id.replace('Input', '')]: errorMessage,
                },
            } as any);
        };

        this.handleDeleteRubric = async (rubricId: number) => {
            try {
                const result = await genericResourceDELETE(`/rubric?rubric_id=${rubricId}`, this);
                if (result && result.errorMessage) {
                throw new Error(result.errorMessage);
                }

                // Success: behave like your current flow (navigate back / reload list)
                this.props.navbar.confirmCreateResource("MyCustomRubrics");
            } catch (error) {
                // Prefer backend message if present; otherwise use the exact copy you asked for.
                const errorMessage = "An error occurred: Cannot delete custom rubric with associated tasks.";

                window.alert(errorMessage);

                // Bubble to parent like ViewUsers does so the inline <ErrorMessage/> shows and clears.
                if (typeof this.props.onError === "function") {
                this.props.onError(errorMessage);
                }

                // Refresh data after a short delay (same pattern used in ViewUsers).
                setTimeout(() => {
                if (typeof this.props.refreshData === "function") {
                    this.props.refreshData();
                }
                }, 1000);
            }
            };

    }

    handleCategorySelect = (categoryId: number, isSelected: boolean) => {
        var allCategories = this.state.allCategories;
        var selectedCategories = this.state.categories;

        if (isSelected) {
            const correctCategory = allCategories.find((category: Category) => category.category_id === categoryId)
            if (correctCategory) selectedCategories.push(correctCategory);
        } else {
            selectedCategories = selectedCategories.filter((category: Category) => category.category_id !== categoryId);
        }
        this.setState({
            categories: selectedCategories
        });
    };

    componentDidMount() {
        var navbar = this.props.navbar;
        var addCustomRubric = navbar.state.addCustomRubric;
        
        this.setState({
            addCustomRubric: addCustomRubric,
            rubricName: addCustomRubric ? "" : navbar.rubric?.rubric_name || "", // Added
            rubricDescription: addCustomRubric ? "" : navbar.rubric?.rubric_description || "", // Added
        });

        var rubricId = navbar.rubricId;
        if (addCustomRubric === false) {
            genericResourceGET(`/category?rubric_id=${rubricId}`, "categories", this);

            genericResourceGET(`/rubric?rubric_id=${rubricId}`, "rubrics", this);
        }
    }

    render() {
        const { categories, isLoaded, isHelpOpen, errors, errorMessage, addCustomRubric, defaultRubrics, allCategories, rubrics } = this.state;

        const categoryTableColumns = [
            {
                name: "category_name",
                label: "Category",
                options: {
                    filter: true,
                    align: "center",
                    customBodyRender: (categoryName: string) => {
                        return <p>{categoryName}</p>;
                    },
                },
            },
            {
                name: "rubric_name",
                label: "Rubric",
                options: {
                    align: "center",
                    customBodyRender: (rubricName: string) => {
                        return <p>{rubricName}</p>;
                    },
                },
            },
        ];

        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "vertical",
            tableBodyMaxHeight: "21rem",
            search: false,
            filter: false,
            viewColumns: false,
        };

        if (errorMessage){
            return(
                <div className='container'>
                    <ErrorMessage
                        errorMessage={errorMessage}
                    />
                </div>
            )
        }

        else if (addCustomRubric===false) {
            if (!isLoaded || !allCategories || !categories || !rubrics){
                return (
                    <Loading />
                )
            }
        }

        var pickedCategories: Category[] = [];
        categories.forEach((category: Category) => {
            if (category) {
                for (let i = 0; i < allCategories.length; i++) {
                    if (allCategories[i]!["category_id"] === category["category_id"]) {
                        pickedCategories.push(allCategories[i]!);
                    }
                }
            }
        });

        return (
            <>
                {this.state.isLoaded && this.state.errorMessage && (
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                )}
                <div>
                    <Grid container spacing={10}>
                        <Grid item xs={6}>
                            <h2
                                style={{
                                    borderBottom: "1px solid #D9D9D9",
                                    paddingTop: "16px",
                                    paddingBottom: "16px",
                                    textAlign: "left",
                                    fontWeight: "bold",
                                }}
                                aria-label="addCustomizeYourRubricTitle"
                            > {this.state.addCustomRubric ? "Customize Your Rubric" : "Edit Your Rubric" }
                            </h2>
                        </Grid>

                        <Grid item xs={6} container justifyContent="flex-end" alignItems="center">
                            {!this.state.addCustomRubric && (
                                <Grid item>
                                    <CustomButton
                                        label="Delete Rubric"
                                        isOutlined={false}
                                        aria-label="customizeYourRubricDeleteRubricButton"
                                        onClick={() => {
                                            this.handleDeleteRubric(rubrics!.rubric_id);
                                        }}
                                        style={{ marginRight: "16px" }}
                                    />
                                </Grid>
                            )}

                            <Grid item>
                                <CustomButton
                                    label={this.state.addCustomRubric ? "Create Rubric" : "Update Rubric"}
                                    isOutlined={false}
                                    aria-label="customizeYourRubricCreateRubricButton"
                                    onClick={() => {
                                        this.handleCreateRubric(pickedCategories);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid
                        style={{
                            justifyContent: "space-between",
                            marginBottom: "1.25rem",
                            flexDirection: "row",
                            alignItems: "center",
                            marginTop: "0.5rem",
                            display: "flex",
                            width: "100%",
                        }}
                    >
                        <Grid style={{ width: "48.25%" }}>
                            <TextField
                                required
                                value={this.state.rubricName}  // Change from defaultValue
                                id="rubricNameInput"
                                label="Rubric Name"
                                style={{ width: "100%" }}
                                error={!!errors.rubricName}
                                helperText={errors.rubricName}
                                onChange={this.handleChange}  // Add this
                                className="text-box-colors"
                                sx={{ 
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'var(--textbox-bg)',
                                        color: 'var(--textbox-text)',
                                        '& fieldset': {
                                            borderColor: 'var(--textbox-border)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--textbox-border-hover)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--textbox-border-focused)',
                                        },
                                        '&.Mui-error fieldset': {
                                            borderColor: 'var(--textbox-error)',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--textbox-label)',
                                        '&.Mui-focused': {
                                            color: 'var(--textbox-border-focused)',
                                        },
                                        '&.Mui-error': {
                                            color: 'var(--textbox-error)',
                                        },
                                    },
                                }}
                                aria-label="customizeYourRubricRubricName"
                            />
                        </Grid>

                        <Grid style={{ width: "48.5%" }}>
                            <TextField
                                required
                                value={this.state.rubricDescription}  // Change from defaultValue
                                id="rubricDescriptionInput"
                                label="Rubric Description"
                                multiline
                                error={!!errors.rubricDescription}
                                helperText={errors.rubricDescription}
                                onChange={this.handleChange}  // Add this
                                style={{ width: "100%" }}
                                className="text-box-colors"
                                sx={{ 
                                    mb: 3,
                                    '& .MuiOutlinedInput-root': {
                                        backgroundColor: 'var(--textbox-bg)',
                                        color: 'var(--textbox-text)',
                                        '& fieldset': {
                                            borderColor: 'var(--textbox-border)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'var(--textbox-border-hover)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'var(--textbox-border-focused)',
                                        },
                                        '&.Mui-error fieldset': {
                                            borderColor: 'var(--textbox-error)',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--textbox-label)',
                                        '&.Mui-focused': {
                                            color: 'var(--textbox-border-focused)',
                                        },
                                        '&.Mui-error': {
                                            color: 'var(--textbox-error)',
                                        },
                                    },
                                }}
                                aria-label="customizeYourRubricRubricDescription"
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={6.5}>
                        <Grid item xs={6}>
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h3 className="d-flex mb-3">Rubrics</h3>
                                <Tooltip title="Help">
                                    <IconButton aria-label="help" onClick={this.toggleHelp}>
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </div>

                            <FormControl error={!!errors.rubricCategories} required fullWidth>
                                <CollapsableRubricCategoryTable
                                    categories={allCategories}
                                    rubrics={defaultRubrics}
                                    onCategorySelect={this.handleCategorySelect}
                                    selectedCategories={pickedCategories}
                                    aria-label="customizeYourRubricRubricCategoryTable"
                                    readOnly={false}
                            />

                                <FormHelperText>{errors.rubricCategories ? "At least one category must be selected" : ""}</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <h3 className="d-flex mb-3" aria-label="yourSelectedCategories">Your Selected Categories</h3>

                            <CustomDataTable
                                data={pickedCategories}
                                columns={categoryTableColumns}
                                options={options}
                            />
                        </Grid>

                        <ImageModal
                            isOpen={isHelpOpen}
                            handleClose={this.toggleHelp}
                            imageUrl={RubricDescriptionsImage}
                            imageUrl2={RubricDescriptionsImage2}
                        />
                    </Grid>
                </div>
            </>
        );
    }
}

export default AddCustomRubric;
