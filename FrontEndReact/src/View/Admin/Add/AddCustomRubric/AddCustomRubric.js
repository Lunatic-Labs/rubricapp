import React from "react";
import Cookies from "universal-cookie";
import { Grid, IconButton, TextField, Tooltip, FormControl } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CustomButton from "./Components/CustomButton.js";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import { genericResourcePOST, genericResourcePUT, genericResourceGET, genericResourceDELETE } from "../../../../utility.js";
import CustomDataTable from "../../../Components/CustomDataTable.js";
import CollapsableRubricCategoryTable from "./CollapsableRubricCategoryTable.js";
import ImageModal from "./CustomRubricModal.js";
import RubricDescriptionsImage from "../../../../../src/RubricDetailedOverview.png";
import Loading from '../../../Loading/Loading.js';
import FormHelperText from '@mui/material/FormHelperText';

class AddCustomRubric extends React.Component {
    constructor(props) {
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

        this.handleCreateRubric = (pickedCategories) => {
            var navbar = this.props.navbar;
            var rubricId = navbar.rubricId;
            var categoryIds = [];
            var rubricName = document.getElementById("rubricNameInput").value
            var rubricDescription = document.getElementById("rubricDescriptionInput").value

            for (var categoryIndex = 0; categoryIndex < pickedCategories.length; categoryIndex++) {
                categoryIds.push(pickedCategories[categoryIndex]["category_id"]);
            }

            if (rubricName === "") {
                this.setState({
                    errors: {
                        rubricName: "Missing New Rubric Name."
                    }
                });
                return;
            } 

            if (rubricDescription === "") {
                this.setState({
                    errors: {
                        rubricDescription: "Missing New Rubric Description."
                    }
                });
                return;
            } 

            if (categoryIds.length === 0) {
                this.setState({
                    isLoaded: true,
                    errors: {
                        rubricCategories: "Missing categories, at least one category must be selected.",
                    }
                });
                return;
            } 
            var cookies = new Cookies();
            if (this.state.addCustomRubric === false) {
                genericResourcePUT(
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
                genericResourcePOST(
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
            this.props.navbar.confirmCreateResource("MyCustomRubrics");
        };
        
        this.handleDeleteRubric = (rubricId) => {
            var navbar = this.props.navbar;

            genericResourceDELETE(`/rubric?rubric_id=${rubricId}`, this);

            navbar.confirmCreateResource("MyCustomRubrics");
        };
    }

    handleCategorySelect = (categoryId, isSelected) => {
        var allCategories = this.state.allCategories;
        var selectedCategories = this.state.categories;

        if (isSelected) {
            const correctCategory = allCategories.find(category => category.category_id === categoryId)
            selectedCategories.push(correctCategory);
        } else {
            selectedCategories = selectedCategories.filter(category => category.category_id !== categoryId);
        }
        this.setState({
            categories: selectedCategories
        });
    };

    componentDidMount() {
        var navbar = this.props.navbar;
        var addCustomRubric = navbar.state.addCustomRubric;
        
        this.setState({
            addCustomRubric: addCustomRubric
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
                    customBodyRender: (categoryName) => {
                        return <p>{categoryName}</p>;
                    },
                },
            },
            {
                name: "rubric_name",
                label: "Rubric",
                options: {
                    align: "center",
                    customBodyRender: (rubricName) => {
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
                        fetchedResource={"Rubric or Category"}
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

        var pickedCategories = [];
        categories.forEach((category) => {
            if (category) {
                for (let i = 0; i < allCategories.length; i++) {
                    if (allCategories[i]["category_id"] === category["category_id"]) {                        
                        pickedCategories.push(allCategories[i]);
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
                                    bold: true,
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
                                            this.handleDeleteRubric(rubrics.rubric_id);
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
                                defaultValue={this.state.addCustomRubric ? "" : rubrics.rubric_name}
                                id="rubricNameInput"
                                label="Rubric Name"
                                style={{ width: "100%" }}
                                error={!!errors.rubricName}
                                helperText={errors.rubricName}
                                aria-label="customizeYourRubricRubricName"
                            />
                        </Grid>

                        <Grid style={{ width: "48.5%" }}>
                            <TextField
                                required
                                defaultValue={this.state.addCustomRubric ? "" : rubrics.rubric_description}
                                id="rubricDescriptionInput"
                                label="Rubric Description"
                                multiline
                                style={{ width: "100%" }}
                                aria-label="customizeYourRubricRubricDescription"
                                error={!!errors.rubricDescription}
                                helperText={errors.rubricDescription}
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
                        />
                    </Grid>
                </div>
            </>
        );
    }
}

export default AddCustomRubric;
